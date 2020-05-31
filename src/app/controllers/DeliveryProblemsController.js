import DeliveryProblems from '../models/DeliveryProblems';

class DeliveryProblemsController {
  async store(req, res) {
    const { orderId: order_id } = req.params;
    const { description } = req.body;

    const deliveryProblems = await DeliveryProblems.create({
      order_id,
      description,
    });

    return res.json(deliveryProblems);
  }

  async index(req, res) {
    const { orderId } = req.params;

    if (orderId) {
      const deliveryProblems = await DeliveryProblems.findAll({
        where: {
          order_id: orderId,
        },
      });

      return res.json(deliveryProblems);
    }

    const deliveryProblems = await DeliveryProblems.findAll();

    return res.json(deliveryProblems);
  }
}

export default new DeliveryProblemsController();
