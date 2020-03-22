import Urls from "./urls";
const orgs = { root: "organizations", paths: ["departments", "users"] };
const urls = Urls(["products", "users", orgs]);
console.log(
  urls.organizations.dynamic(":id/:user/:id", { id: 3, user: "Waju" })
);
console.log(
  Urls.compile(
    urls.organizations.users, {departments: 3})
)
);
document.getElementById("app").innerHTML = `
<h1>Hello Parcel!</h1>
`;
