import { CommonEntity } from '@project/src/common/entity/common.entity'
import { Exclude } from 'class-transformer'
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, Relation } from 'typeorm'
import { AccessTokenEntity } from '../auth/entities/access-token.entity'
import { RoleEntity } from '../system/role/role.entity'

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  username: string

  //被标记为 @Exclude() 的属性将不会被包含在输出结果中
  @Exclude()
  @Column()
  password: string

  @Column({ length: 32 })
  psalt: string

  @Column({ nullable: true })
  nickname: string

  @Column({ name: 'avatar', nullable: true })
  avatar: string

  @Column({ nullable: true })
  qq: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  remark: string

  @Column({ type: 'tinyint', nullable: true, default: 1 })
  status: number

  @Column({ nullable: true, default: '1' })
  type: string

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'sys_user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Relation<RoleEntity[]>

  @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
    cascade: true,
  })
  accessTokens: Relation<AccessTokenEntity[]>
}
