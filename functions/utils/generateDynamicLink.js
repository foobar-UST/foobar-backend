const axios = require('axios');

const generateLongDynamicLink = (deepLink) => {
  const androidPackageName = 'com.foobarust.android';
  const androidFallbackLink = 'https://foobar-group-delivery-app.web.app';
  const androidMinPackageVersionCode = null;
  const iosBundleId = 'com.example.ios';

  return `https://foobarust.page.link/?link=${deepLink}&apn=${androidPackageName}&afl=${androidFallbackLink}&amv=${androidMinPackageVersionCode}&ibi=${iosBundleId}`;
};

/**
 * Generate a Firebase Dynamic Link for a given deep link.
 * @param deepLink
 * @returns short dynamic link, null if failed
 */
const generateShortDynamicLink = async deepLink => {
  try {
    let response = await axios.post(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.WEB_API_KEY}`, {
        dynamicLinkInfo: {
          domainUriPrefix: 'https://foobarust.page.link',
          link: deepLink,
          androidInfo: {
            androidPackageName: 'com.foobarust.android',
            androidFallbackLink: 'https://foobar-group-delivery-app.web.app',
            androidMinPackageVersionCode: null
          },
          iosInfo: {
            iosBundleId: 'com.example.ios'
          }
        }
      }
    );

    return response.data.shortLink;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  generateLongDynamicLink,
  generateShortDynamicLink
};