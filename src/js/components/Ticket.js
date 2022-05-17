const popups = [...document.querySelectorAll('.popup')];
const editTicketForm = document.getElementById('edit-ticket-form');
const deleteTicketPopup = document.querySelector('.delete-ticket-popup');

export default class Ticket {
  constructor(data, server) {
    this.server = server;

    this.id = data?.id;
    this.name = data?.name;
    this.status = data?.status;
    this.created = data?.created;
    this.description = data?.description;
  }

  render() {
    this.li = document.createElement('li');
    this.li.className = 'app__task task-app';
    this.li.dataset.id = this.id;

    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'task-app__main';

    this.leftDiv = document.createElement('div');
    this.leftDiv.className = 'task-app__left';
    this.checkbox = document.createElement('div');
    this.checkbox.className = 'task-app__checkbox';
    this.leftDiv.appendChild(this.checkbox);
    this.textEl = document.createElement('span');
    this.textEl.className = 'task-app__text';
    this.textEl.textContent = this.name;
    this.leftDiv.appendChild(this.textEl);

    this.rightDiv = document.createElement('div');
    this.rightDiv.className = 'task-app__right';
    this.ticketDate = document.createElement('span');
    this.ticketDate.className = 'task-app__date';
    this.ticketDate.textContent = this.formatDate(this.created);
    this.rightDiv.appendChild(this.ticketDate);

    this.controllers = document.createElement('div');
    this.controllers.className = 'task-app__conrollers task-controllers';
    this.editController = document.createElement('div');
    this.editController.className =
      'task-controllers__controller controller-edit';
    this.deleteController = document.createElement('div');
    this.deleteController.className =
      'task-controllers__controller controller-delete';
    this.controllers.appendChild(this.editController);
    this.controllers.appendChild(this.deleteController);
    this.rightDiv.appendChild(this.controllers);

    this.mainDiv.appendChild(this.leftDiv);
    this.mainDiv.appendChild(this.rightDiv);

    this.detailsDiv = document.createElement('div');
    this.detailsDiv.className = 'task-app__details';
    this.detailsText = document.createElement('p');
    this.detailsText.textContent = this.description;
    this.detailsDiv.appendChild(this.detailsText);

    this.li.appendChild(this.mainDiv);
    this.li.appendChild(this.detailsDiv);

    this.addListeners();

    return this.li;
  }

  addListeners() {
    this.li.addEventListener('click', (evt) => {
      if (
        !evt.target.classList.contains('task-app__checkbox') &&
        !evt.target.classList.contains('controller-edit') &&
        !evt.target.classList.contains('controller-delete')
      ) {
        if (!this.detailsDiv.classList.contains('show')) {
          this.server.getFullTicket(this.id).then((response) => {
            if (response.description) {
              this.detailsText.textContent = response.description;
              this.detailsDiv.classList.add('show');
              return;
            } else {
              return;
            }
          });
        } else {
          this.detailsDiv.classList.remove('show');
        }
      }

      if (evt.target.classList.contains('task-app__checkbox')) {
        this.checkbox.classList.toggle('_active');

        if (this.checkbox.classList.contains('_active')) {
          this.status = true;
        } else {
          this.status = false;
        }

        const data = { id: this.id, status: this.status };
        this.server
          .POSTData(data, 'editTicket')
          .then((response) => console.log(response.status));
        return;
      }

      if (evt.target.classList.contains('controller-edit')) {
        popups.forEach((popup) => popup.classList.remove('show'));
        editTicketForm.closest('.popup').classList.add('show');

        editTicketForm.addEventListener('click', (evt) => {
          if (evt.target.classList.contains('cancel-btn')) {
            editTicketForm.closest('.popup').classList.remove('show');
            return;
          } else if (evt.target.classList.contains('ok-btn')) {
            const formData = new FormData(evt.currentTarget);
            this.name = formData.get('name') ? formData.get('name') : this.name;
            this.description = formData.get('description')
              ? formData.get('description')
              : this.description;

            const data = {
              id: this.id,
              name: this.name,
              description: this.description,
            };

            this.server.POSTData(data, 'editTicket').then((response) => {
              this.textEl.textContent = response.name;
              this.detailsText.textContent = response.description;
            });
            editTicketForm.reset();
            editTicketForm.closest('.popup').classList.remove('show');
            return;
          }
        });
      }

      if (evt.target.classList.contains('controller-delete')) {
        popups.forEach((popup) => popup.classList.remove('show'));
        deleteTicketPopup.classList.add('show');
        deleteTicketPopup.addEventListener('click', (evt) => {
          if (evt.target.classList.contains('cancel-btn')) {
            deleteTicketPopup.classList.remove('show');
            return;
          } else if (evt.target.classList.contains('ok-btn')) {
            const data = { id: this.id };
            this.server.POSTData(data, 'deleteTicket').then((response) => {
              if (response.status) {
                document.querySelector(`[data-id='${response.id}']`).remove();
                deleteTicketPopup.classList.remove('show');
              } else {
                return;
              }
            });
          }
        });
      }
    });
  }

  formatDate(timecode) {
    const date = new Date(timecode);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month =
      date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
    const year = String(date.getFullYear()).slice(-2);
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minute =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

    return formattedDate;
  }
}
