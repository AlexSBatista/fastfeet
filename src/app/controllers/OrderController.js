import { parseISO, getHours } from 'date-fns';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblems from '../models/DeliveryProblems';
import Queue from '../../lib/Queue';
import WithdrawalMail from '../jobs/WithdrawalMail';
import CancelledOrderMail from '../jobs/CancelledOrderMail';

class OrderController {
  async store(req, res) {
    const order = await Order.create(req.body);

    const orderDetail = await Order.findByPk(order.id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(WithdrawalMail.key, {
      orderDetail,
    });

    return res.json(orderDetail);
  }

  async index(req, res) {
    const order = await Order.findAll({
      order: [['id', 'DESC']],
    });

    return res.json(order);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.body.id);

    const result = await order.update(req.body);

    return res.json(result);
  }

  async delete(req, res) {
    const { problemId } = req.params;

    if (problemId) {
      const deliveryProblems = await DeliveryProblems.findByPk(problemId);

      const order = await Order.findByPk(deliveryProblems.order_id, {
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['name', 'email'],
          },
        ],
      });

      const result = await order.update({ canceled_at: new Date() });

      await Queue.add(CancelledOrderMail.key, {
        order,
      });

      return res.json(result);
    }

    const order = await Order.findByPk(req.body.id);

    order.destroy();

    return res.json();
  }
}

export default new OrderController();
