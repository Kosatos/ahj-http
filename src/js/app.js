import Ticket from './components/Ticket';
import API from './API';

window.onload = () => {
  const server = new API('localhost', 8080);

  const ticketList = document.querySelector('.app__tasks');
  const addTicketForm = document.getElementById('add-ticket-form');

  [...document.forms].forEach((form) => {
    form.addEventListener('submit', (evt) => evt.preventDefault());
  });

  try {
    server.getAll().then((response) => {
      render(response);
    });
  } catch (error) {
    console.log(err.message);
  }

  document.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('app__add-btn')) {
      addTicketForm.closest('.popup').classList.add('show');
      return;
    }
  });

  addTicketForm.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('ok-btn')) {
      addTicket(evt);
      evt.currentTarget.reset();
      addTicketForm.closest('.popup').classList.remove('show');
      return;
    }

    if (evt.target.classList.contains('cancel-btn')) {
      addTicketForm.closest('.popup').classList.remove('show');
      return;
    }
  });

  function addTicket(evt) {
    const formData = new FormData(evt.currentTarget);
    if (!formData.get('name')) {
      console.error('Поле не может быть пустым');
      return;
    }
    const data = {
      name: formData.get('name'),
      status: false,
      description: formData.get('description'),
    };
    server
      .POSTData(data, 'createTicket')
      .then((response) => render([response]));
  }

  function render(res) {
    res.forEach((item) => {
      ticketList.appendChild(new Ticket(item, server).render());
    });
  }
};
