# Local MongoDB Setup for Windows

## Option 1: MongoDB Community Server (Recommended)

### Download and Install:
1. Go to https://www.mongodb.com/try/download/community
2. Select Windows version
3. Choose "MSI" installer
4. Download and run the installer
5. During installation:
   - Choose "Complete" setup
   - Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (optional GUI tool)
   - Leave default settings

### Start MongoDB:
- MongoDB should start automatically as a Windows service
- If not, run: `net start MongoDB` in Command Prompt (as Administrator)

### Connection String:
```
mongodb://localhost:27017/yassah-accounting
```

## Option 2: Using MongoDB with Docker (Alternative)

If you have Docker installed:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Option 3: MongoDB Portable (No Installation)

Download MongoDB portable version and run without installation.

## Verification:

After installation, test the connection:
```bash
# In Command Prompt
mongosh
# Or
mongo
```

If you see the MongoDB shell, it's working correctly.
