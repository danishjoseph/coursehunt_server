let constants = require('../config/constants');

// superAdmin =  
module.exports = allowedRoutes = {
  //SuperAdmin
  [constants.ROLE_SUPER_ADMIN]: [
    '/',
    '',
    '/login',
    '/signup',
    '/home',
    '/categories',
    '/platforms',
    '/editor/platform',
    '/editor/category',
    '/editor/course',
    '/editor/users',
    '/editor/blogs',
    '/editor/course/requests',
    '/editor/favs'
  ],
    //editor
  [constants.ROLE_EDITOR]: [
    '',
    '/',
        '/login',
        '/signup',
        '/home',
        '/categories',
        '/platforms',
        '/editor/platform',
        '/editor/category',
        '/editor/blogs',
        '/editor/course',
        '/editor/favs'
  ],
    //user
  [constants.ROLE_USER]: [
    '',
    '/',
        '/login',
        '/signup',
        '/home',
        '/categories',
        '/platforms',
        '/editor/course',
        '/editor/favs'
  ]
}

module.exports = allowedMenus = {
  //superADmin
  "61cc898a7db791d9c8190413": [
    {
      label: "Platform",
      icon: "pi pi-briefcase",
      routerLink: ["/editor/platform"],
    },
    {
      label: "Category",
      icon: "pi pi-desktop",
      routerLink: ["/editor/category"],
    },
    {
      label: "Courses",
      icon: "pi pi-video",
      routerLink: ["/editor/course"],
    },
    {
      label: "Course Requests",
      icon: "pi pi-video",
      routerLink: ["/editor/course/requests"],
    },
    {
      label: "Users",
      icon: "pi pi-video",
      routerLink: ["/editor/users"],
    },
    {
      label: "Blogs",
      icon: "pi pi-video",
      routerLink: ["/editor/blogs"],
    },
    {
      label: "Favs",
      icon: "pi pi-heart",
      routerLink: ["/editor/favs"],
    },
  ],
  //editor
    "61cc89d264e38011f4a29bc3": [
        {
          label: "Platform",
          icon: "pi pi-briefcase",
          routerLink: ["/editor/platform"],
        },
        {
          label: "Category",
          icon: "pi pi-desktop",
          routerLink: ["/editor/category"],
        },
        {
          label: "Courses",
          icon: "pi pi-video",
          routerLink: ["/editor/course"],
        },
        {
          label: "Favs",
          icon: "pi pi-heart",
          routerLink: ["/editor/favs"],
        },
      ],
      "61cc89df64e38011f4a29bc5": [
        {
          label: "Courses",
          icon: "pi pi-video",
          routerLink: ["/editor/course"],
        },
        {
          label: "Favs",
          icon: "pi pi-heart",
          routerLink: ["/editor/favs"],
        },
      ]
}

