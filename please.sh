
update_docker(){
  docker-compose pull $1 && docker-compose up -d $1
}

help_please(){
  echo "Usage: ./please <command> <serviceName / version>"
  echo "Commands:"
  echo "update                 # pull and update all services"
  echo "update <serviceName>   # pull and update given service."
}

case $1 in
  update) update_docker $2;;
  help) help_please;;
  *) help_please
esac
