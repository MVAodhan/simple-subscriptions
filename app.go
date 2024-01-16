package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

type Subscription struct {
	Id        string    `gorm:"primaryKey" json:"Id"`
	Name      string    `json:"Name"`
	Price     string    `json:"Price"`
	CreatedAt time.Time `json:"CreatedAt"` // Automatically managed by GORM for creation time
	UpdatedAt time.Time `json:"UpdatedAt"` // Automatically managed by GORM for update time
}

var db *gorm.DB

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.connectToDB()
	a.createTables()
}

func (a *App) connectToDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}
	dsn := os.Getenv("DATABASE_URL")
	conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Error connecting to the db")
		return
	}

	db = conn
	log.Println("Connected To DB")
}

func (a *App) createTables() {
	db.AutoMigrate(Subscription{})
}

func (a *App) GetAllRecords() (string, error) {
	var subscriptions []Subscription
	result := db.Find(&subscriptions)

	if result.Error != nil {
		log.Fatalln("Error executing query:", result.Error)
	}

	data, err := json.Marshal(subscriptions)
	if err != nil {
		log.Fatalf("Failed to marshal data: %v", err)
	}

	return string(data), nil
}

func (a *App) CreateRecord(name string, price string) {

	v4, err := uuid.NewRandom()
	if err != nil {
		log.Println("Error creating uuid", err)
		return
	}

	v4Str := v4.String()
	log.Println(name)
	log.Println(price)

	subscription := Subscription{Id: v4Str, Name: name, Price: price}
	result := db.Create(&subscription)

	log.Printf(fmt.Sprint(result.RowsAffected))
}

func (a *App) GenUUID() (string, error) {
	v4, err := uuid.NewRandom()

	if err != nil {
		return "", err
	}

	return v4.String(), nil
}

func (a *App) DeleteById(id string) {
	db.Delete(&Subscription{}, "Id = ?", id)
}
