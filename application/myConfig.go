package application

type myConfig struct {
	dbSession interface{}
	dbName    string
	dbAddress string
}

var Config myConfig

func (this *myConfig) SetDB(session interface{}) {
	this.dbSession = session
}

func (this *myConfig) GetDB() interface{} {
	return this.dbSession
}

func (this *myConfig) SetDBName(dbName string) {
	this.dbName = dbName
}

func (this *myConfig) GetDBName() string {
	return this.dbName
}

func (this *myConfig) SetDBAddress(dbAddress string) {
	this.dbAddress = dbAddress
}

func (this *myConfig) GetDBAddress() string {
	return this.dbAddress
}

func (this *myConfig) InitConfig() {
	this.SetDBName("myMaid")
	this.SetDBAddress("mongodb://localhost/")
	MongoConnection.StartSession()
	Config.SetDB(MongoConnection.GetSession())
}
