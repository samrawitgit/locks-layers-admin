import { useContext, useEffect } from 'react';
import Head from 'next/head';

import { AppContext } from '@utils/containers/app.container';

function HomePage(props) {

  return (
    <div>
      <Head>
        <title>Locks&Layers</title>
        <meta
          name='description'
          content='Locks&Layers admin application'
        />
      </Head>
      <h1>Welcome</h1>
    </div>
  );
}

// export async function getStaticProps(context) {
//   // const featuredEvents = await getFeaturedEvents();

//   return {
//     props: {
//       // events: featuredEvents,
//     },
//     // revalidate: 1800,
//   };
// }

export default HomePage