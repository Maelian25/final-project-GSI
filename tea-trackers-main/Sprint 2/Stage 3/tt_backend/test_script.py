# db_test.py
import pyodbc

try:
    # Replace with your actual details
    conn_str = (
        'DRIVER={ODBC Driver 18 for SQL Server};'
        'SERVER=ttdb.database.windows.net;'  # Your server name
        'DATABASE=tea-trackersbd;'       # Your database name
        'UID=admin_ttdb;'                 # Your username
        'PWD=TeaTrackers_db_pass.?'                  # Your password
    )
    conn = pyodbc.connect(conn_str, timeout=10)  # Added a timeout of 10 seconds
    print("Connection successful")
except Exception as e:
    print("Error connecting to database:", e)
