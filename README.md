# 🚀 TECHBUDDY NANO

## 🤖 Project Overview

This is the **robust and optimized backend** that powers TechBuddy Nano (your chat frontend!). Built in Python, this API proves that it's possible to create lightweight, high-performance Artificial Intelligence systems.

**My focus:** Using modern technologies like **Flask** and the **Gunicorn** production server to ensure the "lightness" (speed and efficiency) that every technology project needs!

---

## ✨ Main Features

* **Communication with AI:** Connects to CometAPI to generate intelligent responses in real time.

* **Standard RESTful API:** `/api/chat` endpoint for message management and conversation history.

* **Security (CORS):** Flask-CORS implementation to allow secure integration with the chat frontend.

* **Production Environment:** Configured to run with **Gunicorn**, ensuring stability and high performance (great for smaller servers or running from my 128GB pendrive! 😉).

## 🛠️ Technologies Used

| Technology | Description |

| :--- | :--- |

| **Python** | Main development language. |

| **Flask** | Fast web micro-framework for building the API. |

| **Gunicorn** | WSGI application server for production. |

| **Flask-CORS** | Extension for handling domain permissions. |

| **CometAPI** | Artificial Intelligence engine for chat responses. |

## ⚙️ How to Run (To Test Speed!)

To test the server's speed on your machine:

1. **Clone the repository:**

``bash
git clone [YOUR REPOSITORY LINK HERE]

cd [YOUR-REPOSITORY-NAME]

```

2. **Install the dependencies:**
*(Remember to install Gunicorn now!)*

``bash
pip install -r requirements.txt

```

3. **Set the API Key:**
*(Optional: If the key is in `app.py`, skip this step.)*

``bash

# Example:

export COMET_API_KEY="your_secret_key"

```

4. **Start the Gunicorn Server:**

*(The command that now works!)*

``bash
gunicorn app:app

# You will see the Message indicating that Gunicorn is listening on a port (e.g., 127.0.0.1:8000)

```
---

## 🙋‍♂️ Author

Made with passion for technology and robotics by:

| Detail | Value |

| :--- | :--- |

| **Name:** | Eric Batista Silva |

| **Channel:** | [Eric - Arte Tecnologia](https://www.youtube.com/@ericartetecnologiaia/videos?sub_confirmation=1) |

| **Notebook:** | Chrome OS Flex running on a 128GB pendrive! 🔋 |

| **LINK:** | [TechBuddy Nano link](https://techbuddy-nano-5.onrender.com)
