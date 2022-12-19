import { useState, useEffect } from "react";

import { Link, Spinner } from "components";
import { Layout } from "components/users";
import { userService } from "services";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DashboardLayout } from "components/dashboard-layout";

export default Index;

function Index() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    userService.getAll().then((x) => setUsers(x));
  }, []);

  function deleteUser(id) {
    setUsers(
      users.map((x) => {
        if (x.id === id) {
          x.isDeleting = true;
        }
        return x;
      })
    );
    userService.delete(id).then(() => {
      setUsers((users) => users.filter((x) => x.id !== id));
    });
  }

  return (
    <Layout>
      <h2>Users</h2>
      <Link href="/users/add" className="btn btn-sm btn-success mb-2">
        Add User
      </Link>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>UserName</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    <Link href={`/users/edit/${user.id}`} component="button">
                      Edit
                    </Link>
                    <Button
                      onClick={() => deleteUser(user.id)}
                      className="btn btn-sm btn-danger btn-delete-user"
                      disabled={user.isDeleting}
                    >
                      {user.isDeleting ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <span>Delete</span>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {!users && (
              <TableRow>
                <TableCell colSpan="4">
                  <Spinner />
                </TableCell>
              </TableRow>
            )}
            {users && !users.length && (
              <TableRow>
                <TableCell colSpan="4" className="text-center">
                  <div className="p-2">No Users To Display</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

Index.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
