import dataJSON from "temporaryData/data"

const DEBUG = false

const fetchData = () =>
  DEBUG && process.env.NODE_ENV !== "production"
    ? dataJSON
    : fetch(`${process.env.NEXT_PUBLIC_API}/community/guilds/all`).then((response) =>
        response.ok ? response.json() : []
      )

export default fetchData
