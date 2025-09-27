#MULTI TENANT NOTES

Multi tenant notes is a **Saas Application** which allows multiple tenants(atleast two tenants namely acme and globex) to secure their tenants(company) users data and notes using the approach of **Shared Database,shared schema** by implementing tenant isolation.

##FEATURES
--The **authentication and Authorization is implemented** on the login of admin and Member of the tenant.
--**Role-based access control**
--**Multi-tenancy support**: data of that particular tenant is shown.
--**Admin functioanlity**: View the notes,Upgrade the subcription limit and Invite users.
--**Member functionality**: Create,Edit,View and delete the notes.

##TECH STACK USED:
--Frontend: **Vite + react**
--Backend: **Node.js, Express.js, Mongodb Atlas**
--Tools: **Postman** to check API Endpoints

##REQUIREMENTS:

Before running in local computer, ensure these to be installed:
1. **NODE.JS** (version 16 & higher recommended).
2. **MONGODB Atlas** account.
3. **GIT** to be installed previously.
4. **npm** (Node Package Manager).

##Steps to run the project:

###1.Clone the repository
```bash
   git clone https://github.com/yourusername/multi-tenant-notes.git
   cd multi-tenant-notes

###2.Connect to backend
```bash
   cd backend
   npm install

###3.In .env file update the strings.
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key

###4.Start the backend server
```bash
   nodemon server.js

###5.Install frontend dependencies
  ```bash
   cd frontend/frontendproj
   npm run dev

**Note--Change the BASE_URL in /frontendproj/src/pages/ to your localhost server**

  

   
