const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://docs.truust.io',
    gaTrackingId: 'UA-128881486-1'
  },
  header: {
    logo: 'https://truust.io/wp-content/uploads/sites/18/2018/12/favicon-azul.png',
    logoLink: 'https://docs.truust.io',
    title: 'Documentation | Truust',
    githubUrl: 'https://github.com/truust-io/docs.truust.io',
    helpUrl: '',
    tweetText: '',
    links: [
      { text: 'Home', link: 'https://truust.io' },
      { text: 'API Reference', link: 'https://dashboard.truust.io/documentation/api-reference/' },
      { text: 'Contact Us', link: 'https://truust.io/contact/' }
    ],
    search: {
      enabled: false,
      indexName: 'Docs',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY
    }
  },
  sidebar: {
    forcedNavOrder: [
      '/introduction',
      '/getting-started',
      '/dashboard',
      '/payment-methods',
      '/payment-flows',
      '/developers'
    ],
    links: [
      { text: 'API Reference', link: 'https://dashboard.truust.io/documentation/api-reference/' }
    ],
    frontline: false,
    ignoreIndex: true
  },
  siteMetadata: {
    title: 'Gatsby Gitbook Boilerplate | Hasura',
    description: 'Documentation built with mdx. Powering learn.hasura.io ',
    ogImage: null,
    docsLocation: 'https://github.com/truust-io/docs.truust.io/tree/master/content',
    favicon: 'https://truust.io/wp-content/uploads/sites/18/2018/12/favicon-azul.png'
  }
};

module.exports = config;
