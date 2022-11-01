db.createUser({
	user: "the_username",
	pwd: "the_password",
	roles: [
		{
			role: "dbOwner",
			db: "the_database",
		},
	],
});

db.createCollection("persons");

db.people.insert({ name: "potato", number: "123-123-123" });
db.people.insert({ name: "peruna", number: "321-321-321" });
db.people.insert({ name: "makkara", number: "456-456-456" });
db.people.insert({ name: "jorma", number: "654-654-654" });