// Feature: digital-menu-qr-system, Property: non-super_admin register requests return 403

/**
 * Validates: Requirements 2.6
 *
 * Property: For any role string that is not 'super_admin', calling
 * requireRole('super_admin') should respond with HTTP 403 and never
 * call next().
 */

import * as fc from 'fast-check';
import { Request, Response, NextFunction } from 'express';
import { requireRole } from '../middleware/requireRole';

function makeMocks() {
  const json = jest.fn().mockReturnThis();
  const status = jest.fn().mockReturnValue({ json });
  const res = { status, json } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;
  return { res, next, status, json };
}

describe('Property: non-super_admin register requests return 403', () => {
  it('should call res.status(403) and never call next() for any role that is not super_admin', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary strings that are NOT 'super_admin'
        fc.string({ minLength: 0, maxLength: 64 }).filter(role => role !== 'super_admin'),
        (role) => {
          const req = {
            user: { id: 'test-id', role, jti: 'test-jti' },
          } as unknown as Request;

          const { res, next, status } = makeMocks();

          requireRole('super_admin')(req, res, next);

          expect(status).toHaveBeenCalledWith(403);
          expect(next).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should call next() when role is super_admin', () => {
    const req = {
      user: { id: 'test-id', role: 'super_admin', jti: 'test-jti' },
    } as unknown as Request;

    const { res, next, status } = makeMocks();

    requireRole('super_admin')(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
  });
});
