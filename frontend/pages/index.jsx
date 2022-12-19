import { userService } from "services";
import { Link } from "components";
import { DashboardLayout } from "components/dashboard-layout";
import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";

export default Home;

function Home() {
  return (
    <>
      <Head>
        <title>Dashboard | Hero Alert</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
            <h2>Dashboard</h2>
          <h4>Hi {userService.userValue?.firstName}!</h4>
          <p>Welcome to Hero Alert system</p>
          <p>
            <Link href="/users">Manage Users</Link>
          </p>
        </Container>
      </Box>
    </>
  );
}

Home.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
