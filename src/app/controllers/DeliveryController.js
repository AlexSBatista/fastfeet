import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  setMinutes,
  setHours,
} from 'date-fns';

import Order from '../models/Order';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const { finish } = req.query;

    if (finish === 'finish') {
      const deliveries = await Order.findAll({
        where: {
          deliveryman_id: req.params.deliverymanId,
          canceled_at: null,
          end_date: {
            [Op.ne]: null,
          },
        },
      });

      return res.json(deliveries);
    }

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        canceled_at: null,
        end_date: null,
      },
    });

    return res.json(deliveries);
  }

  async startDelivery(req, res) {
    const { deliverymanId, orderId } = req.params;

    const order = await Order.findByPk(orderId);

    if (order.startDate !== null) {
      return res
        .status(400)
        .json({ error: 'This delivery has already started.' });
    }

    // eslint-disable-next-line radix
    if (Order.deliveryman_id !== parseInt(deliverymanId)) {
      return res.status(400).json({
        error:
          'You cannot register this delivery the deliveryman Id does not match',
      });
    }

    const count_deliveries = await Order.count({
      where: {
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.between]: [startOfDay(), endOfDay()],
        },
      },
    });

    if (count_deliveries === 5) {
      res
        .status(400)
        .json({ error: 'You cannot get more than 5 deliveries per day' });
    }

    if (order.canceled_at) {
      res.status(400).json({ error: 'This delivery is already cancelled' });
    }

    // Time check
    if (
      !isAfter(new Date(), setMinutes(setHours(new Date(), 4), 59)) ||
      !isBefore(new Date(), setMinutes(setHours(new Date(), 15), 0))
    ) {
      return res.status(400).json({
        message: 'You can just start a delivery between 08am and 06pm',
      });
    }

    await Order.update({
      start_date: new Date(),
    });

    return res.json();
  }

  async finishDelivery(req, res) {
    const { deliverymanId, orderId } = req.params;

    const order = await Order.findByPk(orderId);

    if (order.start_date === null) {
      return res.status(400).json({
        message: 'This delivery is not started',
      });
    }

    // eslint-disable-next-line radix
    if (Order.deliveryman_id !== parseInt(deliverymanId)) {
      return res.status(400).json({
        error:
          'You cannot register this delivery the deliveryman Id does not match',
      });
    }

    const { originalname: name, filename: path } = req.file;

    const { id } = await File.create({
      name,
      path,
    });

    order.update({
      signature_id: id,
      end_date: new Date(),
    });

    return res.json({
      signaturePath: path,
    });
  }
}

export default new DeliveryController();
