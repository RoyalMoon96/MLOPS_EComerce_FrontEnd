const statusSteps = [
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED"
]

export function orderTimeline(status) {

  const currentIndex = statusSteps.indexOf(status)

  const progressPercent =
    (currentIndex / (statusSteps.length - 1)) * 100

  return `
    <div class="order-timeline">

      <div class="timeline-line"></div>

      <div class="timeline-progress"
           style="width:${progressPercent}%"></div>

      ${statusSteps.map((step, index) => {

        const completed = index <= currentIndex

        return `
          <div class="timeline-step">

            <div class="timeline-circle ${completed ? "completed" : ""}">
              ${completed ? "✓" : ""}
            </div>

            <div class="timeline-label">
              ${step}
            </div>

          </div>
        `

      }).join("")}

    </div>
  `
}