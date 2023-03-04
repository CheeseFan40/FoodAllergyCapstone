import pymongo

myclient = pymongo.MongoClient("mongodb+srv://MitchZ:T2GRPvC0AkjRuDL8@cluster0.edbmsue.mongodb.net/test")
mydb = myclient["testdatabase"]

mycol = mydb["customers123"]

mydict = { "name": "John", "address": "Highway 37" }

x = mycol.insert_one(mydict)