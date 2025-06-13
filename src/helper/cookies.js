export function setCookie(name, value, daysToLive) {
  // Encode value in order to escape semicolons, commas, and whitespace
  let cookie = name + '=' + encodeURIComponent(value);
 
  if (typeof daysToLive === 'number') {
    var time = new Date(new Date().setSeconds(new Date().getSeconds() + daysToLive)).toUTCString();
    /* Sets the max-age attribute so that the cookie expires
        after the specified number of days */
    cookie += '; expires=' + time + ';path=/';
 
    document.cookie = cookie;
  }
}
 
export function getCookie(name) {
  // Split cookie string and get all individual name=value pairs in an array
  let cookieArr = document.cookie.split(';') ?? [''];
 
  // Loop through the array elements
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i]?.split('=') ?? [''];
    /* Removing whitespace at the beginning of the cookie name
                    and compare it with the given string */
    if (cookiePair[0] && cookiePair[1] && name == cookiePair[0]?.trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }
  // Return null if not found
  return null;
}
 
export function eraseCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}