from flask import Flask,jsonify,request
from flask_cors import CORS
import mysql.connector as sql
import os


db_user = os.getenv("user") | "avnadmin"
db_host = os.getenv("host") | "farmiq-mysql-farmiq010-277c.h.aivencloud.com"
db_pass = os.getenv("pass") | "AVNS_sr_v_vrFGFroeHBkZXx"
db_port = os.getenv("port") | 13233

def conn():
    try:
        connection = sql.connect(host = db_host,
                                    user = db_user,
                                    password = db_pass,
                                    port = db_port,
                                    database = "defaultdb")

        cursor = connection.cursor()

        return connection,cursor
    except Exception as e:
        print("Error Connecting to Database ",e)
        raise





app = Flask(__name__)
CORS(app)


@app.route("/",methods = ["GET"])
def default():
    return jsonify({"message": "FarmIQ Backend Running Successfully"}), 200

@app.route("/login",methods = ["GET","POST"])
def login():
    email = request.form.get("email")
    pwd = request.form.get("password")

    try:
        connection,cursor = conn()
        cursor.execute("Select user_email from users")
        emails = cursor.fetchall()
        if (email,) in emails:
            cursor.execute("Select * from users where user_email = %s",(email,))
            user, = tuple(cursor.fetchall())
            if pwd == user[3]:
                return jsonify({
                    "message": f"Welcome {user[1]}",
                    "name": user[1],
                    "user_id": user[0],
                    "role": user[4]
                }), 200
            else:
                return jsonify({"error": "Incorrect password"}), 401
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print("Error during login:", e)
        return jsonify({"error": "Internal server error"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/register",methods = ["GET","POST"])
def register():
    name = str(request.form.get("name"))
    email = str(request.form.get("email"))
    pwd = str(request.form.get("password"))
    role = str(request.form.get("role"))

    try:
        connection,cursor = conn()
        #Before Inserting
        cursor.execute("Select user_email from users")
        emails = cursor.fetchall()
        if (email,) in emails:
            return jsonify({"error": "User already exists"}), 409

        #Inserting User
        query = "insert into users(user_name,user_email,user_pwd,user_role) values (%s,%s,%s,%s)"
        cursor.execute(query,(name,email,pwd,role))
        connection.commit()

        #After Inserting
        cursor.execute("Select user_id from users where user_email = %s",(email,))
        (user_id,), = tuple(cursor.fetchall())


        return jsonify({
            "message": f"{role} {name} registered successfully",
            "user_id": user_id
        }), 201
    except Exception as e:
        print("Error during registration:", e)
        return jsonify({"error": "Internal server error"}), 500
    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    app.run(debug=True)