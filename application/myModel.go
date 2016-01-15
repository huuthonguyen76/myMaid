package application

import (
	"gopkg.in/mgo.v2"
)

func getDbSession(dbSession interface{}) *mgo.Session {
	return (dbSession).(*mgo.Session)
}

func CreateDbConnection(dbSession interface{}, dbName string) *mgo.Database {
	session := getDbSession(dbSession)
	return session.DB(dbName)
}
