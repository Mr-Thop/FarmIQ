from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector as sql
import os
import jwt
import datetime
from functools import wraps

# Environment variables with defaults
db_user = os.getenv("user") or "avnadmin"
db_host = os.getenv("host") or "farmiq-mysql-farmiq010-277c.h.aivencloud.com"
db_pass = os.getenv("pass") or "AVNS_sr_v_vrFGFroeHBkZXx"
db_port = int(os.getenv("port") or 13233)



SECRET_KEY = 'f059d4507faf907d515844116d466d815667dca0d33be3f3e0044558c30d19e5'

def conn():
    return sql.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        port=db_port,
        database="defaultdb"
    )

app = Flask(__name__)
CORS(app)

# JWT Auth Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if token and token.startswith("Bearer "):
            token = token.split(" ")[1]
        else:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = data
        except:
            return jsonify({"error": "Token is invalid"}), 403

        return f(*args, **kwargs)
    return decorated

# Register
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.json
    name, email, password, role = data.get("name"), data.get("email"), data.get("password"), data.get("role")

    try:
        con = conn()
        cur = con.cursor()
        cur.execute("SELECT * FROM users WHERE user_email=%s", (email,))
        if cur.fetchone():
            return jsonify({"error": "User already exists"}), 409

        cur.execute("INSERT INTO users (user_name, user_email, user_pwd, user_role) VALUES (%s, %s, %s, %s)",
                    (name, email, password, role))
        con.commit()
        user_id = cur.lastrowid

        token = jwt.encode({
            "user_id": user_id,
            "email": email,
            "role": role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)

        return jsonify({
            "user": {"id": user_id, "name": name, "email": email, "role": role},
            "token": token
        }), 201

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error"}), 500
    finally:
        cur.close()
        con.close()

# Login
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    email, password = data.get("email"), data.get("password")

    try:
        con = conn()
        cur = con.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE user_email=%s", (email,))
        user = cur.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user["user_pwd"] != password:
            return jsonify({"error": "Invalid credentials"}), 401

        token = jwt.encode({
            "user_id": user["user_id"],
            "email": email,
            "role": user["user_role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY)

        return jsonify({
            "user": {
                "id": user["user_id"],
                "name": user["user_name"],
                "email": user["user_email"],
                "role": user["user_role"]
            },
            "token": token
        })

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error"}), 500
    finally:
        cur.close()
        con.close()

# Logout (token invalidation would require token blacklist, not done here)
@app.route("/api/auth/logout", methods=["POST"])
def logout():
    return jsonify({"success": "Logged out (client should delete token)"}), 200

# Get current user
@app.route("/api/auth/me", methods=["GET"])
@token_required
def get_profile():
    return jsonify({"user": request.user})

# Update profile
@app.route("/api/auth/me", methods=["PUT"])
@token_required
def update_profile():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")

    try:
        con = conn()
        cur = con.cursor()
        cur.execute("UPDATE users SET user_name=%s, user_email=%s WHERE user_id=%s",
                    (name, email, request.user["user_id"]))
        con.commit()
        return jsonify({"user": {
            "id": request.user["user_id"],
            "name": name,
            "email": email
        }}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Server error"}), 500
    finally:
        cur.close()
        con.close()

# Password reset (mocked)
@app.route("/api/auth/password/reset", methods=["POST"])
def reset_password():
    data = request.json
    email = data.get("email")
    # Here you’d normally send an email with a reset link/token
    return jsonify({"success": f"Password reset link sent to {email} (mocked)"}), 200

# Default Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "FarmIQ Backend Running"}), 200


# Create new farm
@app.route("/api/farms", methods=["POST"])
@token_required
def create_farm():
    data = request.json
    name = data.get("name")
    location = data.get("location")
    size = data.get("size")
    crop_type = data.get("crop_type")

    try:
        con = conn()
        cur = con.cursor()
        cur.execute("""
            INSERT INTO farms (user_id, farm_name, farm_location, farm_size, farm_crop_type)
            VALUES (%s, %s, %s, %s, %s)
        """, (request.user["user_id"], name, location, size, crop_type))
        con.commit()
        return jsonify({"success": "Farm created"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": "Error creating farm"}), 500
    finally:
        cur.close()
        con.close()

# Get all farms for current user
@app.route("/api/farms", methods=["GET"])
@token_required
def get_farms():
    try:
        con = conn()
        cur = con.cursor(dictionary=True)
        cur.execute("SELECT * FROM farms WHERE user_id=%s", (request.user["user_id"],))
        farms = cur.fetchall()
        return jsonify(farms), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Error fetching farms"}), 500
    finally:
        cur.close()
        con.close()

# Get single farm by ID
@app.route("/api/farms/<int:farm_id>", methods=["GET"])
@token_required
def get_farm(farm_id):
    try:
        con = conn()
        cur = con.cursor(dictionary=True)
        cur.execute("SELECT * FROM farms WHERE farm_id=%s AND user_id=%s", (farm_id, request.user["user_id"]))
        farm = cur.fetchone()
        if not farm:
            return jsonify({"error": "Farm not found"}), 404
        return jsonify(farm), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Error fetching farm"}), 500
    finally:
        cur.close()
        con.close()

# Update farm
@app.route("/api/farms/<int:farm_id>", methods=["PUT"])
@token_required
def update_farm(farm_id):
    data = request.json
    name = data.get("name")
    location = data.get("location")
    size = data.get("size")
    crop_type = data.get("crop_type")

    try:
        con = conn()
        cur = con.cursor()
        cur.execute("""
            UPDATE farms SET farm_name=%s, farm_location=%s, farm_size=%s, farm_crop_type=%s
            WHERE farm_id=%s AND user_id=%s
        """, (name, location, size, crop_type, farm_id, request.user["user_id"]))
        con.commit()
        return jsonify({"success": "Farm updated"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Error updating farm"}), 500
    finally:
        cur.close()
        con.close()

# Delete farm
@app.route("/api/farms/<int:farm_id>", methods=["DELETE"])
@token_required
def delete_farm(farm_id):
    try:
        con = conn()
        cur = con.cursor()
        cur.execute("DELETE FROM farms WHERE farm_id=%s AND user_id=%s", (farm_id, request.user["user_id"]))
        con.commit()
        return jsonify({"success": "Farm deleted"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Error deleting farm"}), 500
    finally:
        cur.close()
        con.close()


# Upload and analyze leaf image
@app.route("/api/leaf-analysis", methods=["POST"])
@token_required
def upload_leaf_analysis():
    data = request.get_json()
    user_id = request.user["user_id"]
    image_url = data.get("image_url")
    plant = data.get("plant")
    disease = data.get("disease")
    confidence = data.get("confidence")
    severity = data.get("severity")
    treatments = data.get("treatments")

    try:
        conn_, cursor = conn()
        query = """
            INSERT INTO leaf_analysis (user_id, image_url, plant, disease, confidence, severity, treatments)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, image_url, plant, disease, confidence, severity, treatments))
        conn_.commit()
        return jsonify({"message": "Leaf analysis saved"}), 201
    except Exception as e:
        print("Leaf Analysis Error:", e)
        return jsonify({"error": "Failed to save leaf analysis"}), 500
    finally:
        cursor.close()
        conn_.close()

# Get user’s leaf analysis history
@app.route("/api/leaf-analysis/history", methods=["GET"])
@token_required
def get_leaf_analysis_history():
    user_id = request.user["user_id"]
    try:
        conn_, cursor = conn()
        cursor.execute("SELECT * FROM leaf_analysis WHERE user_id = %s", (user_id,))
        rows = cursor.fetchall()
        result = [{
            "id": row[0],
            "image_url": row[2],
            "plant": row[3],
            "disease": row[4],
            "confidence": row[5],
            "severity": row[6],
            "treatments": row[7],
            "created_at": str(row[8])
        } for row in rows]
        return jsonify({"history": result}), 200
    except Exception as e:
        print("Leaf Analysis History Error:", e)
        return jsonify({"error": "Failed to retrieve history"}), 500
    finally:
        cursor.close()
        conn_.close()

# Get specific analysis by ID
@app.route("/api/leaf-analysis/<int:analysis_id>", methods=["GET"])
@token_required
def get_leaf_analysis_by_id(analysis_id):
    user_id = request.user["user_id"]
    try:
        conn_, cursor = conn()
        cursor.execute("SELECT * FROM leaf_analysis WHERE id = %s AND user_id = %s", (analysis_id, user_id))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Analysis not found"}), 404
        result = {
            "id": row[0],
            "image_url": row[2],
            "plant": row[3],
            "disease": row[4],
            "confidence": row[5],
            "severity": row[6],
            "treatments": row[7],
            "created_at": str(row[8])
        }
        return jsonify({"analysis": result}), 200
    except Exception as e:
        print("Leaf Analysis Detail Error:", e)
        return jsonify({"error": "Failed to retrieve analysis"}), 500
    finally:
        cursor.close()
        conn_.close()

# Static plant disease data
@app.route("/api/diseases", methods=["GET"])
def get_diseases():
    diseases = [
        {"plant": "Tomato", "disease": "Early Blight", "treatment": "Remove infected leaves, use copper fungicide"},
        {"plant": "Wheat", "disease": "Rust", "treatment": "Apply fungicides early"},
        {"plant": "Rice", "disease": "Leaf Blast", "treatment": "Improve drainage, spray fungicide"},
    ]
    return jsonify({"diseases": diseases}), 200


# Get reviews for a farm
@app.route("/api/farms/<int:farm_id>/reviews", methods=["GET"])
def get_farm_reviews(farm_id):
    try:
        conn_, cursor = conn()
        cursor.execute("SELECT * FROM farm_reviews WHERE farm_id = %s", (farm_id,))
        rows = cursor.fetchall()
        reviews = [{
            "id": row[0],
            "user_id": row[2],
            "rating": row[3],
            "comment": row[4],
            "created_at": str(row[5])
        } for row in rows]
        return jsonify({"reviews": reviews}), 200
    except Exception as e:
        print("Farm Reviews Fetch Error:", e)
        return jsonify({"error": "Failed to fetch reviews"}), 500
    finally:
        cursor.close()
        conn_.close()

# Add a new review for a farm
@app.route("/api/farms/<int:farm_id>/reviews", methods=["POST"])
@token_required
def add_farm_review(farm_id):
    data = request.get_json()
    user_id = request.user["user_id"]
    rating = data.get("rating")
    comment = data.get("comment")

    try:
        conn_, cursor = conn()
        cursor.execute("""
            INSERT INTO farm_reviews (farm_id, user_id, rating, comment)
            VALUES (%s, %s, %s, %s)
        """, (farm_id, user_id, rating, comment))
        conn_.commit()
        return jsonify({"message": "Review added"}), 201
    except Exception as e:
        print("Add Review Error:", e)
        return jsonify({"error": "Failed to add review"}), 500
    finally:
        cursor.close()
        conn_.close()


# Get saved items
@app.route("/api/saved-items", methods=["GET"])
@token_required
def get_saved_items():
    user_id = request.user["user_id"]
    try:
        conn_, cursor = conn()
        cursor.execute("SELECT * FROM saved_items WHERE user_id = %s", (user_id,))
        rows = cursor.fetchall()
        saved = [{
            "id": row[0],
            "item_type": row[2],
            "item_id": row[3],
            "created_at": str(row[4])
        } for row in rows]
        return jsonify({"saved_items": saved}), 200
    except Exception as e:
        print("Saved Items Error:", e)
        return jsonify({"error": "Failed to fetch saved items"}), 500
    finally:
        cursor.close()
        conn_.close()

# Save an item
@app.route("/api/saved-items", methods=["POST"])
@token_required
def save_item():
    data = request.get_json()
    user_id = request.user["user_id"]
    item_type = data.get("item_type")
    item_id = data.get("item_id")

    try:
        conn_, cursor = conn()
        cursor.execute("""
            INSERT INTO saved_items (user_id, item_type, item_id)
            VALUES (%s, %s, %s)
        """, (user_id, item_type, item_id))
        conn_.commit()
        return jsonify({"message": "Item saved"}), 201
    except Exception as e:
        print("Save Item Error:", e)
        return jsonify({"error": "Failed to save item"}), 500
    finally:
        cursor.close()
        conn_.close()

# Delete a saved item
@app.route("/api/saved-items/<int:item_id>", methods=["DELETE"])
@token_required
def delete_saved_item(item_id):
    user_id = request.user["user_id"]
    try:
        conn_, cursor = conn()
        cursor.execute("DELETE FROM saved_items WHERE id = %s AND user_id = %s", (item_id, user_id))
        conn_.commit()
        return jsonify({"message": "Saved item removed"}), 200
    except Exception as e:
        print("Delete Saved Error:", e)
        return jsonify({"error": "Failed to remove saved item"}), 500
    finally:
        cursor.close()
        conn_.close()



# Upload and analyze soil image
@app.route("/api/soil-analysis", methods=["POST"])
@token_required
def soil_analysis():
    if 'image' not in request.files:
        return jsonify({"error": "Image is required"}), 400

    image = request.files['image']
    filename = f"soil_{int(datetime.time())}.jpg"
    filepath = os.path.join("uploads", filename)
    image.save(filepath)

    # Simulated analysis
    result = "Loamy soil with good nitrogen content"
    recommendations = "Use organic compost. Ideal for vegetables."

    try:
        con = conn()
        cur = con.cursor()
        cur.execute("""
            INSERT INTO soil_analysis (user_id, image_url, result, recommendations)
            VALUES (%s, %s, %s, %s)
        """, (request.user["user_id"], filepath, result, recommendations))
        con.commit()
        return jsonify({
            "result": result,
            "recommendations": recommendations,
            "image_url": filepath
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        con.close()


# Get soil analysis history
@app.route("/api/soil-analysis/history", methods=["GET"])
@token_required
def get_soil_history():
    try:
        con = conn()
        cur = con.cursor(dictionary=True)
        cur.execute("SELECT * FROM soil_analysis WHERE user_id=%s", (request.user["user_id"],))
        results = cur.fetchall()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        con.close()


# Get specific analysis
@app.route("/api/soil-analysis/<int:id>", methods=["GET"])
@token_required
def get_soil_by_id(id):
    try:
        con = conn()
        cur = con.cursor(dictionary=True)
        cur.execute("SELECT * FROM soil_analysis WHERE id=%s AND user_id=%s", (id, request.user["user_id"]))
        result = cur.fetchone()
        if not result:
            return jsonify({"error": "Not found"}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        con.close()


# Save analysis (noop - already saved in upload above)
@app.route("/api/soil-analysis/<int:id>/save", methods=["POST"])
@token_required
def save_soil(id):
    # Already saved, just respond for compatibility
    return jsonify({"success": "Analysis already saved"}), 200


@app.route("/api/weather/current", methods=["GET"])
@token_required
def weather_current():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    if not lat or not lng:
        return jsonify({"error": "lat and lng are required"}), 400

    # Simulated response
    response = {
        "location": {"lat": lat, "lng": lng},
        "current": {
            "temperature": 27.4,
            "humidity": 60,
            "condition": "Partly Cloudy",
            "wind_speed": 10,
        },
        "forecast": [
            {"day": "Mon", "temp": 28, "condition": "Sunny"},
            {"day": "Tue", "temp": 30, "condition": "Cloudy"},
        ]
    }
    return jsonify(response), 200


@app.route("/api/weather/forecast", methods=["GET"])
@token_required
def weather_forecast():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    days = int(request.args.get("days", 3))

    if not lat or not lng:
        return jsonify({"error": "lat and lng required"}), 400

    # Mock forecast
    forecast = [
        {"day": f"Day {i+1}", "temperature": 25 + i, "condition": "Sunny" if i % 2 == 0 else "Cloudy"}
        for i in range(days)
    ]

    return jsonify({"forecast": forecast}), 200


@app.route("/api/weather/alerts", methods=["GET"])
@token_required
def weather_alerts():
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    if not lat or not lng:
        return jsonify({"error": "lat and lng are required"}), 400

    alerts = [
        {
            "title": "Heatwave Alert",
            "severity": "moderate",
            "description": "Temperatures expected to reach 40°C in the afternoon. Stay hydrated.",
            "effective": "2025-05-13T12:00:00Z",
            "expires": "2025-05-13T18:00:00Z"
        }
    ]
    return jsonify({"alerts": alerts}), 200


@app.route("/api/calendar", methods=["GET"])
@token_required
def get_calendar():
    user_id = request.user["user_id"]
    month = request.args.get("month")
    year = request.args.get("year")

    try:
        connection, cursor = conn()
        query = "SELECT * FROM calendar_events WHERE user_id = %s"
        params = [user_id]

        if month and year:
            query += " AND MONTH(date) = %s AND YEAR(date) = %s"
            params.extend([month, year])

        cursor.execute(query, tuple(params))
        events = cursor.fetchall()

        data = [{
            "id": e[0],
            "title": e[2],
            "crop": e[3],
            "description": e[4],
            "date": str(e[5])
        } for e in events]

        return jsonify({"events": data}), 200
    except Exception as e:
        print("Calendar fetch error:", e)
        return jsonify({"error": "Failed to retrieve calendar"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/calendar", methods=["POST"])
@token_required
def add_calendar_event():
    user_id = request.user["user_id"]
    data = request.get_json()

    title = data.get("title")
    crop = data.get("crop")
    desc = data.get("description")
    date = data.get("date")

    try:
        connection, cursor = conn()
        query = """
        INSERT INTO calendar_events(user_id, title, crop, description, date)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, title, crop, desc, date))
        connection.commit()
        return jsonify({"message": "Event added"}), 201
    except Exception as e:
        print("Add event error:", e)
        return jsonify({"error": "Failed to add event"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/api/calendar/<int:event_id>", methods=["PUT"])
@token_required
def update_calendar_event(event_id):
    user_id = request.user["user_id"]
    data = request.get_json()

    try:
        connection, cursor = conn()
        cursor.execute("""
        UPDATE calendar_events
        SET title=%s, crop=%s, description=%s, date=%s
        WHERE id=%s AND user_id=%s
        """, (data["title"], data["crop"], data["description"], data["date"], event_id, user_id))
        connection.commit()
        return jsonify({"message": "Event updated"}), 200
    except Exception as e:
        print("Update error:", e)
        return jsonify({"error": "Failed to update event"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/calendar/<int:event_id>", methods=["DELETE"])
@token_required
def delete_calendar_event(event_id):
    user_id = request.user["user_id"]

    try:
        connection, cursor = conn()
        cursor.execute("DELETE FROM calendar_events WHERE id=%s AND user_id=%s", (event_id, user_id))
        connection.commit()
        return jsonify({"message": "Event deleted"}), 200
    except Exception as e:
        print("Delete error:", e)
        return jsonify({"error": "Failed to delete event"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/crops/planting-guide", methods=["GET"])
@token_required
def get_planting_guide():
    zone = request.args.get("zone")
    season = request.args.get("season")

    # Static sample response
    guide = [
        {"crop": "Tomato", "best_season": "Spring", "zone": "Tropical"},
        {"crop": "Wheat", "best_season": "Winter", "zone": "Temperate"},
    ]
    filtered = [c for c in guide if
                (not zone or c["zone"] == zone) and
                (not season or c["best_season"] == season)]

    return jsonify({"crops": filtered}), 200


@app.route("/api/products", methods=["GET"])
def get_products():
    query = request.args
    filters = []
    values = []

    if "search" in query:
        filters.append("name LIKE %s")
        values.append(f"%{query['search']}%")

    if "category" in query:
        filters.append("category = %s")
        values.append(query["category"])

    if "organic" in query:
        filters.append("organic = %s")
        values.append(query["organic"] == "true")

    if "availability" in query:
        filters.append("available = %s")
        values.append(query["availability"] == "true")

    where = f"WHERE {' AND '.join(filters)}" if filters else ""
    sql = f"SELECT * FROM products {where} LIMIT 100"

    try:
        connection, cursor = conn()
        cursor.execute(sql, tuple(values))
        rows = cursor.fetchall()
        products = [{
            "id": r[0],
            "name": r[2],
            "description": r[3],
            "price": float(r[4]),
            "unit": r[5],
            "image": r[6],
            "category": r[7],
            "organic": bool(r[8]),
            "available": bool(r[9]),
            "farm_id": r[10]
        } for r in rows]
        return jsonify({"products": products}), 200
    except Exception as e:
        print("Get products error:", e)
        return jsonify({"error": "Could not fetch products"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    try:
        connection, cursor = conn()
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        p = cursor.fetchone()
        if not p:
            return jsonify({"error": "Product not found"}), 404

        product = {
            "id": p[0],
            "name": p[2],
            "description": p[3],
            "price": float(p[4]),
            "unit": p[5],
            "image": p[6],
            "category": p[7],
            "organic": bool(p[8]),
            "available": bool(p[9]),
            "farm_id": p[10]
        }
        return jsonify({"product": product}), 200
    except Exception as e:
        print("Get product error:", e)
        return jsonify({"error": "Could not fetch product"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/products", methods=["POST"])
@token_required
def add_product():
    user_id = request.user["user_id"]
    data = request.get_json()

    try:
        connection, cursor = conn()
        cursor.execute("""
        INSERT INTO products (user_id, name, description, price, unit, image_url, category, organic, available, farm_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_id, data["name"], data["description"], data["price"], data["unit"],
            data.get("image"), data.get("category"), data.get("organic", False),
            data.get("available", True), data.get("farm_id")
        ))
        connection.commit()
        return jsonify({"message": "Product created"}), 201
    except Exception as e:
        print("Add product error:", e)
        return jsonify({"error": "Could not create product"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/products/<int:product_id>", methods=["PUT"])
@token_required
def update_product(product_id):
    user_id = request.user["user_id"]
    data = request.get_json()

    try:
        connection, cursor = conn()
        cursor.execute("""
        UPDATE products SET name=%s, description=%s, price=%s, unit=%s,
            image_url=%s, category=%s, organic=%s, available=%s
        WHERE id=%s AND user_id=%s
        """, (
            data["name"], data["description"], data["price"], data["unit"],
            data["image"], data["category"], data.get("organic", False),
            data.get("available", True), product_id, user_id
        ))
        connection.commit()
        return jsonify({"message": "Product updated"}), 200
    except Exception as e:
        print("Update product error:", e)
        return jsonify({"error": "Update failed"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/products/<int:product_id>", methods=["DELETE"])
@token_required
def delete_product(product_id):
    user_id = request.user["user_id"]

    try:
        connection, cursor = conn()
        cursor.execute("DELETE FROM products WHERE id=%s AND user_id=%s", (product_id, user_id))
        connection.commit()
        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        print("Delete product error:", e)
        return jsonify({"error": "Deletion failed"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/categories", methods=["GET"])
def get_categories():
    # Static example
    categories = ["Vegetables", "Fruits", "Grains", "Seeds", "Fertilizers"]
    return jsonify({"categories": categories}), 200


@app.route("/api/cart", methods=["GET"])
@token_required
def get_cart():
    user_id = request.user["user_id"]
    try:
        connection, cursor = conn()
        cursor.execute("""
            SELECT ci.id, ci.quantity, p.name, p.price, p.unit, p.image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = %s
        """, (user_id,))
        items = cursor.fetchall()

        cart = []
        subtotal = 0
        for item in items:
            cart.append({
                "id": item[0],
                "quantity": item[1],
                "name": item[2],
                "price": float(item[3]),
                "unit": item[4],
                "image": item[5]
            })
            subtotal += item[1] * float(item[3])
        return jsonify({"items": cart, "subtotal": subtotal}), 200
    except Exception as e:
        print("Cart fetch error:", e)
        return jsonify({"error": "Failed to load cart"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/api/cart", methods=["POST"])
@token_required
def add_to_cart():
    user_id = request.user["user_id"]
    data = request.get_json()
    product_id = data["productId"]
    quantity = data["quantity"]

    try:
        connection, cursor = conn()
        # Check if item exists in cart
        cursor.execute("SELECT id FROM cart_items WHERE user_id=%s AND product_id=%s", (user_id, product_id))
        existing = cursor.fetchone()

        if existing:
            cursor.execute("UPDATE cart_items SET quantity = quantity + %s WHERE id = %s", (quantity, existing[0]))
        else:
            cursor.execute("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (%s, %s, %s)", (user_id, product_id, quantity))

        connection.commit()
        return jsonify({"message": "Item added to cart"}), 201
    except Exception as e:
        print("Add to cart error:", e)
        return jsonify({"error": "Could not add to cart"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/api/cart/<int:item_id>", methods=["PUT"])
@token_required
def update_cart_item(item_id):
    user_id = request.user["user_id"]
    data = request.get_json()
    quantity = data["quantity"]

    try:
        connection, cursor = conn()
        cursor.execute("UPDATE cart_items SET quantity = %s WHERE id = %s AND user_id = %s", (quantity, item_id, user_id))
        connection.commit()
        return jsonify({"message": "Cart updated"}), 200
    except Exception as e:
        print("Update cart error:", e)
        return jsonify({"error": "Could not update cart"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/api/cart/<int:item_id>", methods=["DELETE"])
@token_required
def remove_cart_item(item_id):
    user_id = request.user["user_id"]

    try:
        connection, cursor = conn()
        cursor.execute("DELETE FROM cart_items WHERE id = %s AND user_id = %s", (item_id, user_id))
        connection.commit()
        return jsonify({"message": "Item removed"}), 200
    except Exception as e:
        print("Remove cart item error:", e)
        return jsonify({"error": "Could not remove item"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/api/orders", methods=["POST"])
@token_required
def create_order():
    user_id = request.user["user_id"]
    data = request.get_json()
    shipping = data["shippingAddress"]
    payment = data["paymentMethod"]

    try:
        connection, cursor = conn()
        # 1. Create order
        cursor.execute("INSERT INTO orders (user_id, shipping_address, payment_method) VALUES (%s, %s, %s)", (user_id, shipping, payment))
        order_id = cursor.lastrowid

        # 2. Fetch cart items
        cursor.execute("""
            SELECT product_id, quantity, p.price FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = %s
        """, (user_id,))
        cart_items = cursor.fetchall()

        # 3. Insert into order_items
        for item in cart_items:
            cursor.execute("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)",
                           (order_id, item[0], item[1], item[2]))

        # 4. Clear cart
        cursor.execute("DELETE FROM cart_items WHERE user_id = %s", (user_id,))
        connection.commit()

        return jsonify({"message": "Order placed", "order_id": order_id}), 201
    except Exception as e:
        print("Order create error:", e)
        return jsonify({"error": "Order failed"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/api/orders", methods=["GET"])
@token_required
def get_orders():
    user_id = request.user["user_id"]

    try:
        connection, cursor = conn()
        cursor.execute("SELECT id, status, created_at FROM orders WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        orders = cursor.fetchall()

        result = [{"id": o[0], "status": o[1], "created_at": o[2].strftime("%Y-%m-%d %H:%M")} for o in orders]
        return jsonify({"orders": result}), 200
    except Exception as e:
        print("Get orders error:", e)
        return jsonify({"error": "Failed to load orders"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/api/orders/<int:order_id>", methods=["GET"])
@token_required
def get_order_by_id(order_id):
    user_id = request.user["user_id"]

    try:
        connection, cursor = conn()
        cursor.execute("SELECT * FROM orders WHERE id = %s AND user_id = %s", (order_id, user_id))
        order = cursor.fetchone()

        if not order:
            return jsonify({"error": "Order not found"}), 404

        cursor.execute("""
            SELECT p.name, oi.quantity, oi.price
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = %s
        """, (order_id,))
        items = cursor.fetchall()

        return jsonify({
            "order": {
                "id": order[0],
                "shipping_address": order[2],
                "payment_method": order[3],
                "status": order[4],
                "created_at": order[5].strftime("%Y-%m-%d %H:%M"),
                "items": [{
                    "name": i[0],
                    "quantity": i[1],
                    "price": float(i[2])
                } for i in items]
            }
        }), 200
    except Exception as e:
        print("Order fetch error:", e)
        return jsonify({"error": "Order not found"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/admin/reports/top-products", methods=["GET"])
@token_required
def top_selling_products():
    try:
        connection, cursor = conn()
        cursor.execute("""
            SELECT p.name, SUM(oi.quantity) AS total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY oi.product_id
            ORDER BY total_sold DESC
            LIMIT 10
        """)
        results = cursor.fetchall()

        top_products = [{"name": r[0], "total_sold": int(r[1])} for r in results]
        return jsonify({"top_products": top_products}), 200
    except Exception as e:
        print("Top products error:", e)
        return jsonify({"error": "Could not fetch report"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/admin/reports/sales-summary", methods=["GET"])
@token_required
def sales_summary():
    try:
        connection, cursor = conn()
        cursor.execute("""
            SELECT 
                COUNT(*) AS total_orders,
                SUM(oi.quantity * oi.price) AS total_sales,
                COUNT(DISTINCT o.user_id) AS unique_customers
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
        """)
        r = cursor.fetchone()
        summary = {
            "total_orders": int(r[0]),
            "total_sales": float(r[1] or 0),
            "unique_customers": int(r[2])
        }
        return jsonify({"summary": summary}), 200
    except Exception as e:
        print("Sales summary error:", e)
        return jsonify({"error": "Could not fetch summary"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/admin/reports/user-activity", methods=["GET"])
@token_required
def user_activity_report():
    try:
        connection, cursor = conn()
        cursor.execute("""
            SELECT u.id, u.name, COUNT(o.id) AS total_orders,
                   SUM(oi.quantity * oi.price) AS total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY u.id
            ORDER BY total_spent DESC
            LIMIT 10
        """)
        rows = cursor.fetchall()
        report = []
        for row in rows:
            report.append({
                "user_id": row[0],
                "name": row[1],
                "total_orders": int(row[2]),
                "total_spent": float(row[3] or 0)
            })
        return jsonify({"users": report}), 200
    except Exception as e:
        print("User activity report error:", e)
        return jsonify({"error": "Could not fetch user report"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/notifications", methods=["GET"])
@token_required
def get_notifications():
    try:
        read_filter = request.args.get("read")
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        offset = (page - 1) * limit

        connection, cursor = conn()
        query = "SELECT id, title, message, is_read, created_at FROM notifications WHERE user_id = %s"
        params = [request.user["user_id"]]

        if read_filter is not None:
            query += " AND is_read = %s"
            params.append(read_filter.lower() == "true")

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()

        notifications = [
            {"id": str(row[0]), "title": row[1], "message": row[2], "is_read": row[3], "created_at": row[4].isoformat()}
            for row in rows
        ]

        return jsonify({"notifications": notifications, "page": page, "limit": limit}), 200
    except Exception as e:
        print("Notification fetch error:", e)
        return jsonify({"error": "Failed to fetch notifications"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/notifications/<uuid:notification_id>/read", methods=["PUT"])
@token_required
def mark_notification_read(notification_id):
    try:
        connection, cursor = conn()
        cursor.execute(
            "UPDATE notifications SET is_read = TRUE WHERE id = %s AND user_id = %s",
            (str(notification_id), request.user["user_id"])
        )
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Notification not found"}), 404

        return jsonify({"message": "Marked as read"}), 200
    except Exception as e:
        print("Mark read error:", e)
        return jsonify({"error": "Failed to mark as read"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/notifications/read-all", methods=["PUT"])
@token_required
def mark_all_notifications_read():
    try:
        connection, cursor = conn()
        cursor.execute(
            "UPDATE notifications SET is_read = TRUE WHERE user_id = %s AND is_read = FALSE",
            (request.user["user_id"],)
        )
        connection.commit()

        return jsonify({"message": "All notifications marked as read"}), 200
    except Exception as e:
        print("Mark all read error:", e)
        return jsonify({"error": "Failed to mark all as read"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/chats", methods=["GET"])
@token_required
def get_user_chats():
    try:
        connection, cursor = conn()
        cursor.execute(
            "SELECT id, created_at FROM chats WHERE user_id = %s ORDER BY created_at DESC",
            (request.user["user_id"],)
        )
        chats = [{"id": str(row[0]), "created_at": row[1].isoformat()} for row in cursor.fetchall()]
        return jsonify({"chats": chats}), 200
    except Exception as e:
        print("Chat history error:", e)
        return jsonify({"error": "Failed to fetch chats"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/chats", methods=["POST"])
@token_required
def start_chat():
    try:
        data = request.get_json()
        message = data.get("message")
        if not message:
            return jsonify({"error": "Message is required"}), 400

        connection, cursor = conn()
        cursor.execute(
            "INSERT INTO chats (user_id) VALUES (%s) RETURNING id", (request.user["user_id"],)
        )
        chat_id = cursor.fetchone()[0]

        cursor.execute(
            "INSERT INTO chat_messages (chat_id, sender_id, content) VALUES (%s, %s, %s)",
            (chat_id, request.user["user_id"], message)
        )
        connection.commit()

        return jsonify({"chat": {"id": str(chat_id), "message": message}}), 201
    except Exception as e:
        print("Start chat error:", e)
        return jsonify({"error": "Failed to start chat"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/chats/<uuid:chat_id>/messages", methods=["GET"])
@token_required
def get_chat_messages(chat_id):
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))
        offset = (page - 1) * limit

        connection, cursor = conn()
        cursor.execute(
            "SELECT id FROM chats WHERE id = %s AND user_id = %s", (str(chat_id), request.user["user_id"])
        )
        if not cursor.fetchone():
            return jsonify({"error": "Chat not found"}), 404

        cursor.execute(
            """
            SELECT id, sender_id, content, created_at FROM chat_messages
            WHERE chat_id = %s ORDER BY created_at ASC
            LIMIT %s OFFSET %s
            """,
            (str(chat_id), limit, offset)
        )
        messages = [
            {
                "id": str(row[0]),
                "sender_id": str(row[1]),
                "content": row[2],
                "created_at": row[3].isoformat()
            }
            for row in cursor.fetchall()
        ]

        return jsonify({"messages": messages}), 200
    except Exception as e:
        print("Get messages error:", e)
        return jsonify({"error": "Failed to fetch messages"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route("/api/chats/<uuid:chat_id>/messages", methods=["POST"])
@token_required
def send_chat_message(chat_id):
    try:
        data = request.get_json()
        content = data.get("content")
        if not content:
            return jsonify({"error": "Message content required"}), 400

        connection, cursor = conn()
        cursor.execute(
            "SELECT id FROM chats WHERE id = %s AND user_id = %s", (str(chat_id), request.user["user_id"])
        )
        if not cursor.fetchone():
            return jsonify({"error": "Chat not found"}), 404

        cursor.execute(
            "INSERT INTO chat_messages (chat_id, sender_id, content) VALUES (%s, %s, %s) RETURNING id, created_at",
            (str(chat_id), request.user["user_id"], content)
        )
        msg_id, created_at = cursor.fetchone()
        connection.commit()

        return jsonify({
            "message": {
                "id": str(msg_id),
                "chat_id": str(chat_id),
                "sender_id": str(request.user["user_id"]),
                "content": content,
                "created_at": created_at.isoformat()
            }
        }), 201
    except Exception as e:
        print("Send message error:", e)
        return jsonify({"error": "Failed to send message"}), 500
    finally:
        cursor.close()
        connection.close()






if __name__ == "__main__":
    app.run(debug=True)
