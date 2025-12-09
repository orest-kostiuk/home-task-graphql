Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3000', 'localhost:3001', 'localhost:3002', '127.0.0.1:3000', '127.0.0.1:3001', '127.0.0.1:3002'

    resource '/graphql',
      headers: :any,
      methods: [:post, :options]
  end
end
