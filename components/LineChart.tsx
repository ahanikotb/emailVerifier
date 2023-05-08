import React, { useEffect } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const dataColor = {
  FullInboxEmails: "red",
  InvalidEmails: "red",
  CatchAllEmails: "orange",
  ValidEmails: "green",
}
function splitStringByUppercase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2")
}
function LineChart({ data }) {
  const [selected, setSelected] = React.useState(null)

  const totalSum = Object.keys(dataColor).reduce((acc, key) => {
    return acc + data[key]
  }, 0)

  // useEffect(() => {
  //   const values = Object.keys(data).map((key) => {
  //     console.log(key)
  //   })
  // }, [data])

  return (
    <div style={{ display: "flex", height: "10px" }}>
      {Object.keys(dataColor).map((key, index) => {
        const borderRadius =
          index === 0
            ? "5px 5px 5px 5px"
            : index === Object.keys(dataColor).length - 1
            ? "0 5px 5px 0"
            : null

        return (
          //           <TooltipProvider>
          //   <Tooltip>
          //     <TooltipTrigger>Hover</TooltipTrigger>
          //     <TooltipContent>
          //       <p>Add to library</p>
          //     </TooltipContent>
          //   </Tooltip>
          // </TooltipProvider>
          <TooltipProvider>
            <Tooltip open={selected == index}>
              <TooltipTrigger asChild>
                <div
                  //@ts-ignore
                  onMouseEnter={() => setSelected(index)}
                  onMouseLeave={() => setSelected(null)}
                  style={{
                    background: dataColor[key],
                    width: `${(data[key] / totalSum) * 100}%`,
                    //@ts-ignore
                    borderRadius,
                  }}
                ></div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {splitStringByUppercase(key)}:{" "}
                  {" " + String(data[key]) + " emails"}
                  <br /> {`${Math.round((data[key] / totalSum) * 100)}%`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}

      {/* <div style={{ background: "red", width: `${}%` }}></div>
      <div style={{ background: "green", width: "10%" }}></div>
      <div style={{ background: "green", width: "80%" }}></div> */}
    </div>
  )
}

export default LineChart
