function modificationNameFormatter(str) {
  if (str?.length > 13) {
    const first = str.slice(0, 6)
    const second = str.slice(6, 13)
    return first + '-' + second + '-' + str.slice(13)
  } else {
    return str
  }
}

export { modificationNameFormatter }
