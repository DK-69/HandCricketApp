const HandSign = ({ number, onClick, glow, isComputer = false }) => {
  return (
    <div>
      {!isComputer ? (
        <button 
          id={`btn${number}`} 
          onClick={onClick}
          className="hand-button"
        >
          <img 
            className={`sign sign${number} ${glow ? glow + '-glow' : ''}`} 
            src={`/sign${number}.webp`} 
            alt={`Sign ${number}`} 
          />
        </button>
      ) : (
        <div>
          <img 
            className={`sign sign${number}`} 
            src={`/sign${number}.webp`} 
            alt={`Computer Sign ${number}`} 
          />
        </div>
      )}
    </div>
  );
};

export default HandSign;