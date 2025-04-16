"use client"; 

const CountdownHome = ({ targetDate }: { targetDate: string }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  return (
    <div className="d-flex text-center pt-4 mb-3">
      {Object.entries(calculateTimeLeft()).map(([unit, value]) => (
        <div key={unit} className="countdown-unit mx-2">
          <span className="countdown-num d-block">{value}</span>
          <span className="countdown-word text-uppercase text-secondary">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownHome;
