try:
    from src.config import settings
    print("Success: settings imported")
    print(f"APP_NAME: {settings.APP_NAME}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
