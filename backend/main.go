// backend/main.go
package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("postgres", "postgres://postgres:arnoarno@localhost:5432/echoreact?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Migrasi tabel users
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `)
	if err != nil {
		log.Fatal(err)
	}

	// Migrasi tabel contents
	_, err = db.Exec(`
    CREATE TABLE IF NOT EXISTS contents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        images TEXT,
        description TEXT,
        summary TEXT
        )
    `)
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://fh7c2k9v-5173.asse.devtunnels.ms", "http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
	}))

	// Routes
	e.POST("/api/register", register)
	e.POST("/api/login", login)
	e.GET("/api/dashboard", dashboard, middleware.JWT([]byte("secret")))
    e.POST("/api/contents", createContent, middleware.JWT([]byte("secret")))
    e.GET("/api/contents", getContents, middleware.JWT([]byte("secret")))
    e.DELETE("/api/contents/:id", deleteContent, middleware.JWT([]byte("secret")))

	e.Logger.Fatal(e.Start(":8080"))
}

// Handler register
func register(c echo.Context) error {
	type User struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var user User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error encrypting password"})
	}

	_, err = db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", user.Username, string(hashedPassword))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error registering user"})
	}
	return c.JSON(http.StatusCreated, map[string]string{"message": "User registered successfully"})
}

// Handler login
func login(c echo.Context) error {
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input"})
	}

	var hashedPassword string
	err := db.QueryRow("SELECT password FROM users WHERE username=$1", req.Username).Scan(&hashedPassword)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password"})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": req.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error generating token"})
	}

	return c.JSON(http.StatusOK, map[string]string{"token": tokenString})
}

// Handler dashboard (hanya dapat diakses setelah login)
func dashboard(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Welcome to the Dashboard!"})
}

// Handler untuk membuat content baru
func createContent(c echo.Context) error {
    type Content struct {
        Title       string `json:"title"`
        Images      string `json:"images"`
        Description string `json:"description"`
        Summary     string `json:"summary"`
    }
    var content Content
    if err := c.Bind(&content); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid input"})
    }

    _, err := db.Exec("INSERT INTO contents (title, images, description, summary) VALUES ($1, $2, $3, $4)",
        content.Title, content.Images, content.Description, content.Summary)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error creating content"})
    }
    return c.JSON(http.StatusCreated, map[string]string{"message": "Content created successfully"})
}

// Handler untuk mendapatkan semua content
func getContents(c echo.Context) error {
    rows, err := db.Query("SELECT id, title, images, description, summary FROM contents")
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching contents"})
    }
    defer rows.Close()

    var contents []map[string]interface{}
    for rows.Next() {
        var id int
        var title, images, description, summary string
        if err := rows.Scan(&id, &title, &images, &description, &summary); err != nil {
            return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error scanning content"})
        }
        contents = append(contents, map[string]interface{}{
            "id":          id,
            "title":       title,
            "images":      images,
            "description": description,
            "summary":     summary,
        })
    }
    return c.JSON(http.StatusOK, contents)
}

// Handler untuk menghapus content
func deleteContent(c echo.Context) error {
    id := c.Param("id")
    _, err := db.Exec("DELETE FROM contents WHERE id = $1", id)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error deleting content"})
    }
    return c.JSON(http.StatusOK, map[string]string{"message": "Content deleted successfully"})
}
