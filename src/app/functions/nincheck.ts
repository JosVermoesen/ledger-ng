export function NinCheck(
  ninString: string,
  yearNow: number,
  gender: 'M' | 'F' | 'W',
  returnText: 'Formatted' | 'ExtendedInfo' | 'NinOnly'
): string {
  const ninLength = ninString.length;
  let stringToReturn = '';
  if (ninLength !== 11) {
    return 'invalid: should be 11 characters long';
  } else {
    let ninToCheck = ninString.substring(0, 9);

    let dPip0: number;
    let dPip: number;
    let dPip2: number;
    let dPip3: number;
    let calcPip: number;

    dPip0 = Number(ninString.substring(0, 2));
    console.log(dPip0);
    if (yearNow - dPip0 < 0) {
    } else {
      ninToCheck = '2' + ninToCheck;
      console.log('born after millenium');
    }

    dPip = Number(ninToCheck);
    dPip2 = Number(ninString.substring(9));
    dPip3 = Number(ninString.substring(6, 9));
    if (dPip3 & 1) {
      // ODD
      gender = 'M';
    } else {
      // EVEN
      gender = 'F';
    }
    calcPip = dPip % 97;
    // console.log(dPip, dPip2, calcPip, 97 - calcPip);

    // check if the pip is correct
    if (97 - calcPip === dPip2) {
      // ok
      switch (returnText) {
        case 'NinOnly':
          stringToReturn = ninString;
          break;

        case 'Formatted':
          // TODO
          stringToReturn = ninString;
          break;

        case 'ExtendedInfo':
          console.log(dPip3);
          if (gender === 'M') {
            stringToReturn =
              (dPip3 + 1) / 2 + 'th MALE born on that day: ' + ninString;
          } else {
            if (gender === 'F') {
              stringToReturn = 'FEMALE: ' + ninString;
            }
          }
          break;
      }
      return stringToReturn;
    }
    return 'invalid: number does not match'; // Add this return statement to fix the problem
  }
}
