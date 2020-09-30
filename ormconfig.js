const root = process.env.NODE_ENV === 'prod' ? 'dist' : 'src' 

module.exports = {
  autoLoadModels: true,
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'car_catalogue',
  entities: [root + '/**/*.entity{.ts,.js}'],
  synchronize: true
}
