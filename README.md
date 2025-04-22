# UserHub
Basic CRUD application developed with Node + Express, designed to create, read, update, and delete users through a REST API. Uses Express.js to handle routes and HTTP requests, returning results in JSON.

---

This project includes Docker support for simplified setup and deployment.  
You can build and run the API in a container without installing Node.js locally using this Docker command:
```bash
docker compose up --build
```
Alternative you can use customized npm scripts:
```bash
npm run up
```
The API will be available at:
http://localhost:3000

---

Use the Swagger UI to explore, test, and interact with the API directly:
- Go to [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Browse through the available endpoints
- Click on any endpoint to see its details
- Press **"Try it out"** to send test requests and view live responses

This interface is especially useful for developers and testers to understand how the API works and experiment with it interactively.

Additionally, it can serve as a lightweight backoffice tool to manually manage API operations during maintenance.

Last version using swagger-jsdoc: as of [commit f0ee8c9](https://github.com/xbaubes/UserHub/blob/f0ee8c91becdbbfc4a328f325923de9c57e885f6/index.js). Now Swagger documentation is generated from an external `swagger.yaml` file instead of inline comments using `swagger-jsdoc`.
