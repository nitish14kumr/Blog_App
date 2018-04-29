#REST (Representational State Transfer)
#RESTful Routing
#CRUD (Create, Read, Update, Delete)

Name        URL             Method  Mongoose Method             Description
==================================================================================================
INDEX       /blogs          GET     Blog.find()                 Display all Campgrounds
NEW         /blogs/new      GET     N/A                         Form to add new Campground
CREATE      /blogs          POST    Blog.create()               Add new Campground
SHOW        /blogs/:id      GET     Blog.findById()             Show Detailed info on a Campground
EDIT        /blogs/:id/edit GET     Blog.findById()             Show Edit form for Campground
UPDATE      /blogs/:id      PUT     Blog.findByIdAndUpdate()    Update a particular Campground
DESTROY     /blogs/:id      DELETE  Blog.findByIdAndRemove()    Delete a particular Campground