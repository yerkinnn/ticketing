import { buildClient } from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? "You are signed in" : "You are not signed in"}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  console.log(" ---------------- [LandingPage] SERVER SIDE ---------------- ");

  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return { currentUser: data.currentUser };
};

export default LandingPage;
