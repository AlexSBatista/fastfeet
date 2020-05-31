import Mail from '../../lib/Mail';

class CancelledOrderMail {
  get key() {
    return 'CancelledOrderMail';
  }

  async handle({ data }) {
    const { deliveryman } = data.order;

    console.log('A fila executou 2');

    Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cancelamento de entrega',
      template: 'cancelledOrder',
      context: {
        deliveryman: deliveryman.name,
        produto: data.order.product,
      },
    });
  }
}

export default new CancelledOrderMail();
