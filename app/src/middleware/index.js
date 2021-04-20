import nacl from 'tweetnacl';
import bodyParser from 'body-parser';

export const parser = bodyParser.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf
  }
})

export function security(req, res, next) {
  try {
    const PUBLIC_KEY = process.env.APPLICATION_PUBLIC_KEY;

    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    const body = req.rawBody.toString(); 

    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(PUBLIC_KEY, 'hex')
    );

    if (isVerified) {
      next();
    } else {
      throw new Error('verification failed');
    }
  } catch {
    return res.status(401).end('invalid request signature');
  };
};

