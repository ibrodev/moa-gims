import { createStyles, Group, Navbar, ScrollArea } from "@mantine/core";
import {
  Briefcase,
  Car,
  CarCrash,
  Gauge,
  Home2,
  Id,
  Tool,
  User,
  Users,
} from "tabler-icons-react";
import useAuth from "../../hooks/useAuth";
import { LinksGroup } from "./NavbarLinksGroup";

const navbarLinksData = [
  { label: "Dashboard", icon: Gauge, roles: ["*"], link: "/" },
  {
    label: "User",
    roles: ["admin"],
    icon: Users,
    links: [
      { label: "All Users", link: "/users", roles: ["admin"] },
      { label: "Create User", link: "/new-user", roles: ["admin"] },
    ],
  },
  {
    label: "Employee",
    roles: ["admin"],
    icon: Id,
    links: [
      { label: "All Employees", link: "/employees", roles: ["admin"] },
      { label: "Create Employee", link: "/new-employee", roles: ["admin"] },
    ],
  },
  {
    label: "Position",
    roles: ["admin"],
    icon: Briefcase,
    links: [
      { label: "All Positions", link: "/positions", roles: ["admin"] },
      { label: "Create Position", link: "/new-position", roles: ["admin"] },
    ],
  },
  {
    label: "Vehicle",
    roles: ["recorder"],
    icon: Car,
    links: [
      { label: "All Vehicles", link: "/vehicles", roles: ["recorder"] },
      { label: "Create Vehicle", link: "/new-vehicle", roles: ["recorder"] },
    ],
  },
  {
    label: "Driver",
    roles: ["recorder"],
    icon: User,
    links: [
      { label: "All Drivers", link: "/drivers", roles: ["recorder"] },
      { label: "Create Driver", link: "/new-driver", roles: ["recorder"] },
    ],
  },
  {
    label: "Department",
    roles: ["admin"],
    icon: Home2,
    links: [
      { label: "All Departments", link: "/departments", roles: ["admin"] },
      { label: "Create Department", link: "/new-department", roles: ["admin"] },
    ],
  },
  {
    label: "Service Request",
    roles: ["team-leader", "recorder", "inspector"],
    icon: CarCrash,
    links: [
      {
        label: "Service Requests",
        link: "/service-requests",
        roles: ["recorder"],
      },
      {
        label: "Add New",
        link: "/new-service-request",
        roles: ["recorder"],
      },
      {
        label: "Received",
        link: "/service-request",
        roles: ["team-leader", "inspector"],
      },
    ],
  },
  {
    label: "Work Order",
    roles: ["inspector", "recorder"],
    icon: Tool,
    links: [
      {
        label: "Work Orders",
        link: "/work-orders",
        roles: ["inspector", "recorder"],
      },
      {
        label: "Add New",
        link: "/new-work-order",
        roles: ["inspector"],
      },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

function MyNavbar(prop: any) {
  const { auth } = useAuth();
  const { classes } = useStyles();

  const filterdNavbarLinksData = navbarLinksData.filter(
    (item) => item.roles.includes("*") || item.roles.includes(auth.userRole)
  );

  const links = filterdNavbarLinksData.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Navbar
      height="100vh"
      width={{ sm: 300 }}
      p="md"
      className={classes.navbar}
      hidden={prop.opened}
    >
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      {/* <Navbar.Section className={classes.footer}> */}
      {/* <UserButton
            image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            name="Ann Nullpointer"
            email="anullpointer@yahoo.com"
          /> */}
      {/* </Navbar.Section> */}
    </Navbar>
  );
}

export default MyNavbar;
