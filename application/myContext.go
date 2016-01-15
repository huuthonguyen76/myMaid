package application

import (
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"net/http"
)

type MyContext struct {
	DbConnection interface{}
	DbSession    interface{}
	Params       map[string]string
}

func (this *MyContext) SetDbConnection(dbConnection interface{}) {
	this.DbConnection = dbConnection
}

func (this MyContext) GetDbConnection() interface{} {
	return this.DbConnection
}

func (this *MyContext) SetDbSession(dbSession interface{}) {
	this.DbSession = dbSession
}

func (this MyContext) GetDbSession() interface{} {
	return this.DbSession
}

func (this *MyContext) SetParams(params map[string]string) {
	this.Params = params
}

func (this MyContext) GetParams() map[string]string {
	return this.Params
}

func (this *MyContext) NewContext(rq *http.Request) {
	var newDbSession = ((Config.GetDB()).(*mgo.Session)).Copy()

	this.SetParams(mux.Vars(rq))
	this.SetDbSession(newDbSession)
	this.SetDbConnection(CreateDbConnection(newDbSession, Config.GetDBName()))
}

func (this *MyContext) CloseContext() {
	((this.GetDbSession()).(*mgo.Session)).Close()
}
