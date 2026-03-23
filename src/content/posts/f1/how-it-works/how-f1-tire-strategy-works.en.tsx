export default function Post() {
  return (
    <article>
      <p>
        Tire strategy is one of the most fascinating and decisive elements of Formula 1 racing.
        A well-executed strategy can vault a driver up the order, while a poor call can ruin even
        the fastest car&apos;s chances. Let&apos;s break down how it all works.
      </p>

      <h2>The Tire Compounds</h2>
      <p>
        Pirelli, F1&apos;s sole tire supplier, brings three dry-weather compounds to each race
        weekend, labeled as Soft (red), Medium (yellow), and Hard (white). The actual rubber
        compounds vary from race to race based on circuit characteristics:
      </p>
      <ul>
        <li><strong>Soft:</strong> Maximum grip, fastest over a single lap, but degrades quickly</li>
        <li><strong>Medium:</strong> A balance between performance and durability</li>
        <li><strong>Hard:</strong> The most durable compound, slowest over a single lap but lasts the longest</li>
      </ul>
      <p>
        In addition to dry compounds, there are Intermediate (green) and Full Wet (blue) tires
        for rainy conditions.
      </p>

      <h2>The Mandatory Pit Stop Rule</h2>
      <p>
        F1 rules require drivers to use at least two different dry-weather compounds during a race
        (unless it rains). This means every driver must make at least one pit stop, creating a
        strategic element around <strong>when</strong> to stop and <strong>which compound</strong> to
        switch to.
      </p>

      <h2>One-Stop vs Two-Stop Strategies</h2>
      <p>
        The most common strategic decision is whether to stop once or twice. Each approach has
        trade-offs:
      </p>
      <ul>
        <li>
          <strong>One-stop:</strong> Less time lost in the pits, but tires must be managed more
          carefully. Usually involves starting on Mediums and switching to Hards (or vice versa).
        </li>
        <li>
          <strong>Two-stop:</strong> More total time in the pit lane, but allows drivers to push
          harder on each stint with fresher tires. Can be faster overall on high-degradation
          circuits.
        </li>
      </ul>

      <h2>The Undercut and Overcut</h2>
      <p>
        Two key tactical moves revolve around the pit window:
      </p>
      <ul>
        <li>
          <strong>Undercut:</strong> Pitting before a rival to get fresh tires and use their
          superior grip to jump ahead. The driver on fresh tires laps much faster, so by the
          time the rival pits, the undercutting driver is ahead.
        </li>
        <li>
          <strong>Overcut:</strong> Staying out longer than a rival, taking advantage of clean air
          and a lighter fuel load. This can work when new tires take time to warm up or when
          track position is critical.
        </li>
      </ul>

      <h2>Safety Cars and Red Flags</h2>
      <p>
        Safety car periods and red flags can completely reshape tire strategy. A safety car
        bunches the field together and dramatically reduces the time cost of a pit stop (since
        all cars are going slowly). Teams that haven&apos;t pitted yet get a &quot;free&quot;
        stop, which is why you&apos;ll see a rush of cars into the pit lane when the safety car
        is deployed.
      </p>

      <h2>Why Strategy Matters</h2>
      <p>
        The best tire strategy depends on dozens of variables: track temperature, tire degradation
        rates, traffic patterns, and the competitive situation. Teams run sophisticated simulations
        before and during races to find the optimal window. But in the chaos of a live race,
        split-second decisions by strategists on the pit wall can be the difference between a
        podium and a points finish.
      </p>
    </article>
  );
}
