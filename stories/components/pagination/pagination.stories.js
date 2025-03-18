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
        "aria-label": "Go to previous page",
      },
      icon_placement: "before",
      icon: "arrow-left",
      text: "Previous",
    },
    pages: {
      1: {
        href: "https://example.com/page/1",
        attributes: {
          "aria-label": "Page 1",
        },
        text: "1",
      },
      2: {
        href: "https://example.com/page/2",
        attributes: {
          "aria-label": "Page 2",
        },
        text: "2",
      },
      3: {
        href: "https://example.com/page/3",
        attributes: {
          "aria-label": "Page 3",
        },
        text: "3",
      },
      4: {
        href: "https://example.com/page/4",
        attributes: {
          "aria-label": "Page 4",
        },
        text: "4",
      },
      5: {
        href: "https://example.com/page/5",
        attributes: {
          "aria-label": "Page 5",
        },
        text: "5",
      },
      6: {
        href: "https://example.com/page/6",
        attributes: {
          "aria-label": "Page 6",
        },
        text: "6",
      },
      7: {
        href: "https://example.com/page/7",
        attributes: {
          "aria-label": "Page 7",
        },
        text: "7",
      },
      8: {
        href: "https://example.com/page/8",
        attributes: {
          "aria-label": "Page 8",
        },
        text: "8",
      },
      9: {
        href: "https://example.com/page/9",
        attributes: {
          "aria-label": "Page 9",
        },
        text: "9",
      },
    },
    next: {
      // href: "https://example.com/page/5",
      attributes: {
        "aria-label": "Next page",
      },
      icon_placement: "after",
      icon: "arrow-right",
      text: "Next",
    },
    last: {
      href: "https://example.com/page/9",
      attributes: {
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
