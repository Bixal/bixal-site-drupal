import Pagination from "./pagination.html.twig";
import "./pagination.scss";

export default {
  title: "Components/Pagination",
  tags: ["autodocs"],
  component: Pagination,
};

const data = {
  headingId: "pagination-heading",
  items: {
    first: {
      href: "https://example.com/page/1",
      attributes: {
        class: ["first", "page-item"],
        "aria-label": "Go to first page",
      },
      text: "1",
    },
    previous: {
      // href: "https://example.com/page/3",
      attributes: {
        class: ["previous", "page-item"],
        "aria-label": "Go to previous page",
      },
      text: "Previous",
    },
    pages: {
      1: {
        href: "https://example.com/page/1",
        attributes: {
          class: ["current", "page-item"],
          "aria-current": "page",
        },
        text: "1",
      },
      2: {
        href: "https://example.com/page/2",
        attributes: {
          class: ["page-item"],
        },
        text: "2",
      },
      3: {
        href: "https://example.com/page/3",
        attributes: {
          class: ["page-item"],
          "aria-label": "Go to page 3",
        },
        text: "3",
      },
      4: {
        href: "https://example.com/page/4",
        attributes: {
          class: ["page-item"],
          "aria-label": "Go to page 4",
        },
        text: "4",
      },
      5: {
        href: "https://example.com/page/5",
        attributes: {
          class: ["page-item"],
          "aria-label": "Go to page 5",
        },
        text: "5",
      },
      6: {
        href: "https://example.com/page/6",
        attributes: {
          class: ["page-item"],
          "aria-label": "Go to page 6",
        },
        text: "6",
      },
      7: {
        href: "https://example.com/page/7",
        attributes: {
          class: ["page-item"],
          "aria-label": "Go to page 7",
        },
        text: "7",
      },
      8: {
        href: "https://example.com/page/8",
        attributes: {
          class: ["page-item"],
          "aria-label": "Go to page 8",
        },
        text: "8",
      },
      9: {
        href: "https://example.com/page/9",
        attributes: {
          class: ["page-item"],
          "aria-label": "Go to page 9",
        },
        text: "9",
      },
    },
    next: {
      // href: "https://example.com/page/5",
      attributes: {
        class: ["next", "page-item"],
        "aria-label": "Go to next page",
      },
      text: "Next",
    },
    last: {
      href: "https://example.com/page/9",
      attributes: {
        class: ["last", "page-item"],
        "aria-label": "Go to last page",
      },
      text: "9",
    },
  },
  current: 1,
};

export const Default = {
  args: {
    ...data,
  },
};
