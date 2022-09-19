import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';
import { Tweet } from '../entities/tweet.entity';

@Injectable()
export class TweetCountService {
  private limit = 10;
  constructor(
    @InjectModel(Tweet)
    private tweetModel: typeof Tweet,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  /* para criar um background jobs eu apenas uso um decorator e 
  informo o timeout em milisegundos que eu quero que ele seja executado */
  @Interval(1000 * 10)
  async countTweets() {
    /* se eu armazenar na memória a aplicacao pode cair, o mais
    indicado é que eu armazene esses dados no bd ou em cache via lin cache-manager
    que é uma lib que pode ser usada com qualquer tecnologia. Eu posso ter
    cache na propria memoria, em um banco redis e por diante */
    let offset: number = await this.cacheManager.get('tweet-offset');

    offset = offset === undefined ? 0 : offset;
    console.log(`Atualmente nosso offset é de ${offset}`);
    const tweets = await this.tweetModel.findAll({
      offset,
      limit: this.limit,
    });
    console.log(`Atualmente temos ${tweets.length} tweets`);

    if (tweets.length === this.limit) {
      const value = offset + this.limit;
      this.cacheManager.set('tweet-offset', value, {
        ttl: 1 * 60 * 10, // prazo de 10 minutos
      });
      console.log('achei mais 10 tweets');
    }
  }

  // na documentacao dá pra marcar dia do mes, semana e outros.
  @Cron('45 * * * * *')
  countTweetsWithDecoratorCron() {
    console.log(`chamada ocorrendo a cadas 45 segundos`);
  }
}
