// src/components/Withdraw.jsx
const Withdraw = ({ coins }) => {
  return (
    <div className="withdraw-screen">
      <h2>💸 Вывести</h2>
      <p className="withdraw-balance">У тебя {coins} монет</p>
      <button className="withdraw-button" disabled>
        🔒 Вывести (временно недоступно)
      </button>
      <p className="withdraw-note">Функция вывода будет доступна позже</p>
    </div>
  );
};

export default Withdraw;

