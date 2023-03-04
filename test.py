import pymongo

<<<<<<< HEAD
myclient = pymongo.MongoClient("mongodb+srv://MitchZ:T2GRPvC0AkjRuDL8@cluster0.edbmsue.mongodb.net/test")
mydb = myclient["testdatabase"]

mycol = mydb["customers123"]

mydict = { "name": "John", "address": "Highway 37" }

x = mycol.insert_one(mydict)
=======
restinput = " "

count = 0

myclient = pymongo.MongoClient("mongodb+srv://AlexM:gp0RAeekxy72CmVG@cluster0.edbmsue.mongodb.net/test")
mydb = myclient["testdatabase"]

mycol = mydb["Allergens"]


restinput = input("Enter Your Restaurant Name")

#count = count + 1
mydict = { "_id": 1, "RestaurantName": "local1" }

newval = { "$set":{ "RestaurantName": f"{restinput}"}}
mydict2 = { "_id": 1, "RestaurantName": f"{restinput}" }

#if count > 1:
mycol.insert_one(mydict)
mycol.delete_one(mydict)
mycol.update_one(mydict, newval)



for x in mycol.find():
    print(x)
>>>>>>> b368c9ec3148789cdb530ba5d0bf71285c6f0845
