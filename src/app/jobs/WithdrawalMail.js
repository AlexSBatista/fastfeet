import Mail from '../../lib/Mail';

class WithdrawalMail {
  get key() {
    return 'WithdrawalMail';
  }

  async handle({ data }) {
    const { deliveryman } = data.orderDetail;

    console.log('A fila executou');

    Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Retirada de produto',
      template: 'withdrawal',
      context: {
        deliveryman: deliveryman.name,
        produto: data.orderDetail.product,
      },
    });
  }
}

export default new WithdrawalMail();
