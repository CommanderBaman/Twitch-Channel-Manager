// convert viewer count text to int
const convertNumTextToInt = (text) => {
  // considering the case if it goes till K
  if (text.toLowerCase().indexOf('k') !== -1) {
    return parseFloat(text.slice(0, -1)) * 1000;
  }
  return parseInt(text);
};

// to ensure functions run and don't fail due to following channels not loaded
const functionWrapper = (count, functionToWrap, timeout) => {
  try {
    functionToWrap();
  } catch (err) {
    setTimeout(() => functionWrapper(count + 1), timeout);
  }
};

// convert data of streamer from channel div
const getChannelInfo = (channel) => {
  const text = channel.innerText;
  const details = text.split('\n').filter((e) => e !== '');

  if (details.length > 2)
    return {
      streamer: details[0].toLowerCase(),
      game: details[1].toLowerCase().replace('-', ' '),
      viewers: convertNumTextToInt(details[3]),
      isOnline: true,
    };
  return {
    streamer: details[0],
    game: '',
    viewers: 0,
    isOnline: false,
  };
};

const makeSortFunction = (sortingOption) => {
  switch (sortingOption) {
    // case 'Priority':
    //   return (channel1, channel2) =>
    //     channel2.priority - channel1.priority;
    case 'Title':
    default:
      return (channel1, channel2) => channel1.game > channel2.game;
  }
};

const defaultSortingFunction = (channel1Element, channel2Element) => {
  const channel1 = getChannelInfo(channel1Element);
  const channel2 = getChannelInfo(channel2Element);

  // if one is offline => push to end
  if (channel1.isOnline ^ channel2.isOnline) {
    return channel1.isOnline ? 0 : 1;
  }
  // if game name is not same compare on that
  if (channel1.game !== channel2.game) {
    return channel1.game > channel2.game;
  }
  // return compare on names
  return channel1.streamer > channel2.streamer;
};

const mainFunction = () => {
  const followedChannelsParentDiv = document.querySelectorAll(
    '.side-nav-section[aria-label="Followed Channels"]'
  )[0];
  const followedChannelsDiv = followedChannelsParentDiv.children[1];

  // // to confirm
  // followedChannelsDiv.style.border = '5px solid red';

  // channel details
  const channels = Array.from(followedChannelsDiv.children);

  // const sortedChannels = channels.map((channel, index) => {
  //   const channelData = getChannelInfo(channel)
  //   return channels[(index + 1) % channels.length];
  // });

  const sortedChannels = channels.toSorted(defaultSortingFunction);
  followedChannelsDiv.replaceChildren(...sortedChannels);

  // console.log({ channels, sortedChannels });
  // console.log(channels);
  // console.log(sortedChannels);

  // const sortedChannels = channels.map((channelElement))
  // followedChannelsDiv = document.querySelectorAll('.side-nav-section[aria-label="Followed Channels"]')[0].children[1]
  // channels = Array.from(followedChannelsDiv.children)
};

const addListenerOnShowButtons = () => {
  // should sort on show more click
  const followedChannelsParentDiv = document.querySelectorAll(
    '.side-nav-section[aria-label="Followed Channels"]'
  )[0];

  const showButtonsDiv =
    followedChannelsParentDiv.childNodes[
      followedChannelsParentDiv.childNodes.length - 1
    ];
  showButtonsDiv.addEventListener('click', () =>
    // wait for transition to end
    setTimeout(() => functionWrapper(0, mainFunction, 2000), 250)
  );
};

// apply functions
functionWrapper(0, mainFunction, 2000);
functionWrapper(0, addListenerOnShowButtons, 2000);

// // run only when page loads
// window.addEventListener('load', eventFunction, false);
