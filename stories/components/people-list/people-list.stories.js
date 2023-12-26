import PeopleList from "./people-list.html.twig";
import Content from "./people-list.content.json";

import "./people-list.scss";

export default {
  title: "Components/People list",
  tags: ["autodocs"],
  component: PeopleList,
  args: Content,
};

export const Default = {};
